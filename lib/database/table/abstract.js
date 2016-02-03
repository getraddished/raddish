"use strict";

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

    this._schema = undefined;
    this.methods = ['select', 'insert', 'update', 'delete'];
}

util.inherits(AbstractTable, ObjectManager);

/**
 * This method will execute a certain command combined with a context.
 * This method will also call specialized for the selected method.
 * The methods callable are: Select, Insert, Update and Delete.
 *
 * @method execute
 * @param {String} method The method to execute.
 * @param {CommandContext} context The context object to use in this call.
 */
AbstractTable.prototype.execute = function(method, context) {
    var self = this,
        chain = this.getCommandChain();
    method = method.toLowerCase();

    if(this.methods.indexOf(method) === -1) {
        throw new RaddishError(500, 'method is not supported');
    }

    return chain.run('initialize.' + method, context)
        .then(function(context) {
            return chain.run('before.' + method, context);
        })
        .then(function(context) {
            return self['_before' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return self.getAdapter()
                .then(function(adapter) {
                    return adapter.execute(context.query);
                });
        })
        .then(function(data) {
            context.result = data;

            return self['_after' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return chain.run('after.' + method, context);
        })
        .then(function(context) {
            return context.result;
        });
};

/**
 * This is the default _beforeSelect method which needs to be overridden!
 *
 * @method _beforeSelect
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._beforeSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _afterSelect method which needs to be overridden!
 *
 * @method _afterSelect
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._afterSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _beforeInsert method which needs to be overridden!
 *
 * @method _beforeInsert
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._beforeInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _afterInsert method which needs to be overridden!
 *
 * @method _afterInsert
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._afterInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _beforeUpdate method which needs to be overridden!
 *
 * @method _beforeUpdate
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._beforeUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the defaul t_afterUpdate method which needs to be overridden!
 *
 * @method _afterUpdate
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._afterUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _beforeDelete method which needs to be overridden!
 *
 * @method _beforeDelete
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._beforeDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This is the default _afterDelete method which needs to be overridden!
 *
 * @method _afterDelete
 * @param {CommandContext} context The context to use in this method
 * @private
 */
AbstractTable.prototype._afterDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
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

    return this.getObject(identifier.setPath(['database', 'adapter']).setName(this.adapter))
        .then(function(adapter) {
            return adapter.getInstance(self.db, self.db_config);
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
                if(self.filters[index]) {
                    schema.columns[index].filter = Filter.getFilter(self.filters[index]);
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
            // There is only one column with auto_increment
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
        return this._schema;
    }

    return self.getAdapter()
        .then(function(adapter) {
            return adapter.getSchema(self.getName());
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
