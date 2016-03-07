"use strict";

/**
 * For the refactor first I need to check which methods need to be there.
 * These will be:
 *
 * - Initialize
 * - getRow
 * - getRowset
 * - execute
 * - getName
 * - getAdapter
 * - getColumns
 * - getUniqueColumns
 * - getIdentityColumn
 */

var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    Inflector       = require('../../inflector/inflector'),
    Filter          = require('../../filter/filter');

/**
 * This class holds the basic methods of the table object.
 *
 * @class AbstractTable
 * @extends ObjectManager
 * @param config
 * @constructor
 */
function AbstractTable(config) {
    ObjectManager.call(this, config);

    this._schema            = undefined;
    this._identity_column   = '';
    this._column_map        = {};
    this._filters           = {};
    this.methods            = ['select', 'insert', 'update', 'delete'];
}

util.inherits(AbstractTable, ObjectManager);

AbstractTable.prototype.initialize = function(config) {
    this._identity_column = config.identity_column || null;
    this._column_map = config.column_map || {};
    this._filters = config.filters || {};

    config.behaviors = config.behaviors || {};

    return ObjectManager.prototype.initialize.call(this, config);
}

/**
 * This method will execute a certain command combined with a context.
 * This method will also call specialized for the selected method.
 * The methods callable are: Select, Insert, Update and Delete.
 *
 * @method execute
 * @param {String} method The method to execute.
 * @param {Query} query This is the query to be executed.
 * @param {Int} mode This is an optional variable for the select mode.
 */
AbstractTable.prototype.execute = function(method, context) {
    var self = this,
        chain = this.getCommandChain();
        //context = new CommandContext();
        //context.data = undefined;
        //context.table = this.getName();
        //context.query = query;
        //context.mode = mode;

    method = method.toLowerCase();

    if(this.methods.indexOf(method) === -1) {
        throw new RaddishError(500, 'method: "' + method + '" is not supported');
    }

    return chain.run('initialize.' + method, context)
        .then(function(context) {
            return chain.run('before.' + method, context);
        })
        /**
         * This part is to be refactored!
         */
        .then(function(context) {
            return self['_before' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return self.getAdapter()
                .then(function(adapter) {
                    return adapter.execute(context.query);
                });
        })
        /**
         * This part is to be refactored!
         */
        .then(function(data) {
            context.result = data;

            return self['_after' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return chain.run('after.' + method, context);
        })
        .then(function() {
            return context.result;
        });
};

/**
 * This method returns the name of the table.
 *
 * @method getName
 * @returns {string} Table name
 */
AbstractTable.prototype.getName = function () {
    return this.name;
};

/**
 * This method will return the adapter associated with the current table object
 *
 * @method getAdapter
 * @returns {Promise} The associated adapter.
 */
AbstractTable.prototype.getAdapter = function() {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'adapter']).setName(this._adapter))
        .then(function(adapter) {
            return adapter.getInstance(self._db, self._db_config);
        });
};

/**
 * This method will return an empty Row object
 * Here we will also cache the Row object for later use.
 *
 * @method getRow
 * @returns {Promise} Returns a Row object
 */
AbstractTable.prototype.getRow = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return self.getObject(identifier.setPath(['database', 'row']), {
        table: self.getIdentifier()
    });
};

/**
 * This method will return an empty Rowset object
 *
 * @method getRowset
 * @returns {Promise} Returns a Rowset object
 */
AbstractTable.prototype.getRowset = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'rowset']), {
        table: self.getIdentifier()
    });
};

/**
 * This method will return all the columns of the table.
 *
 * @method getColumns
 * @returns {Promise} The columns of the table.
 */
AbstractTable.prototype.getColumns = function () {
    var self = this;

    return this.getSchema()
        .then(function(schema) {
            schema.columns = self.mapColumns(schema.columns, true);

            for(var index in schema.columns) {
                if(self._filters[index]) {
                    schema.columns[index].filter = Filter.getFilter(self._filters[index]);
                }
            }

            return schema.columns;
        });
};

/**
 * This method will return the unique columns of the table
 *
 * @method getUniqueColumns
 * @returns {Promise} The unique columns of the table.
 */
AbstractTable.prototype.getUniqueColumns = function () {
    var self = this;
    var fields = {};

    return self.getColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns[index] && columns[index].unique) {
                    fields[index] = columns[index];
                }
            }

            return fields;
        });
};

/**
 * This method will return the single identity column, identified by the auto_increment value.
 *
 * @method getIdentityColumn
 * @returns {Promise} The promise with the identity column.
 */
AbstractTable.prototype.getIdentityColumn = function() {
    var self = this;

    if(self._identity_column) {
        return self._identity_column;
    }

    return self.getUniqueColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns[index].autoinc) {
                    return columns[index].name;
                }
            }
        });
};

/**
 * This method will check if the table exists or not, if not, it will return an error.
 * Else an object with its schema is returned.
 *
 * @method getSchema
 * @returns {Promise} The promise with the complete schema.
 */
AbstractTable.prototype.getSchema = function() {
    var self = this;

    if(this._schema !== undefined) {
        return Promise.resolve(this._schema);
    }

    return self.getAdapter()
        .then(function(adapter) {
            return adapter.getSchema(self.getName());
        })
        .then(function(schema) {
            self._schema = schema;

            return schema;
        });
};

/**
 * This method will translate table columns to their original values, or visa versa.
 * This will work on the column_map variable.
 *
 * @method mapColumns
 * @param {Object} object The object with the column map
 * @param {Boolean} reverse Wether or not to reverse the behavior
 * @private
 */
AbstractTable.prototype.mapColumns = function(object, reverse) {
    var map = reverse ? array_flip(this._column_map) : this._column_map;

    if(object instanceof Object) {
        for(var index in object) {
            if(map[index]) {
                object[map[index]] = object[index];
                delete object[index];
            }
        }
    }

    return object;
};

function array_flip(trans) {
    var key, tmp_ar = {};

    if (trans && typeof trans === 'object' && trans.change_key_case) {
        return trans.flip();
    }

    for (key in trans) {
        if (!trans.hasOwnProperty(key)) {
            continue;
        }
        tmp_ar[trans[key]] = key;
    }

    return tmp_ar;
}

module.exports = AbstractTable;
