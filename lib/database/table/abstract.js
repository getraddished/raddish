"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    Inflector       = require('../../inflector/inflector'),
    Filter          = require('../../filter/filter'),
    CommandContext  = require('../../command/context/context');

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

    this.context = new CommandContext();
    this.methods = [];

    this.adapter = null;
    this.adapter_name = '';
    this.adapter_config = {};

    this._columns = {};
    this._column_map = {};
    this._identity_column = null;
}

util.inherits(AbstractTable, ObjectManager);

AbstractTable.prototype.initialize = function(config) {
    var self = this;

    this.name = config.name || this.name || false;
    this._column_map = config.column_map || {};

    // Set the behaviors.
    config.behaviors = config.behaviors || {};

    return ObjectManager.prototype.initialize.call(this, config);
};

AbstractTable.prototype.getName = function() {
    return this.name;
};

AbstractTable.prototype.getContext = function() {
    return this.context;
};

/**
 * Execute method override to check if the method is allowed, if yes run the parent.
 *
 * @method execute
 * @param {String} method The method to execute
 * @param {CommandContext} context The context which needs to be run.
 * @returns {Promise} The result of the execute method.
 */
AbstractTable.prototype.execute = function(method, context) {
    if(this.methods.indexOf(method) == -1 || !self['_action' + Inflector.capitalize(method)]) {
        throw new RaddishError(500, 'method:' + method + ' isn\'t allowed or function definition is missing!');
    }

    return ObjectManager.prototype.execute.call(this, method, context);
};

AbstractTable.prototype.getAdapter = function() {
    var self = this;

    if(this.adapter !== null) {
        var identifier = this.getIdentifier().clone();

        return this.getObject(identifier.setPath(['database', 'adapter']).setName(this.adapter))
            .then(function(adapter) {
                return adapter.getInstance(self.adapter_name, self.adapter_config)
            });
    }

    return Promise.reject(this.adapter);
};

AbstractTable.prototype.getQuery = function() {
    return this.getAdapter()
        .then(function(adapter) {
            return adapter.getQuery();
        });
};

AbstractTable.prototype.getColumns = function() {
    var columns = {},
        self = this;

    return this.getAdapter()
        .then(function(adapter) {
            return adapter.getSchema(self.getName());
        })
        .then(function(schema) {
            for(var index in schema.columns) {
                if(schema.columns.hasOwnProperty(index)) {
                    var column = schema.columns[index];
                    columns[index] = column;
                }
            }

            return columns;
        });
};

AbstractTable.prototype.getColumns = function() {
    return this.mapColumns(this._columns, true) || {};
};

AbstractTable.prototype.getUniqueColumns = function() {
    var cols = {};

    return this.getColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns.hasOwnProperty(index)) {
                    var column = columns[index];
                    if(column.unique) {
                        cols[index] = column;
                    }
                }
            }

            return cols;
        });
};

AbstractTable.prototype.getIdentityColumn = function() {
    return this._identity_column;
};

AbstractTable.prototype.mapColumns = function(columns, reverse) {
    var map = reverse ? array_flip(this._column_map) : this._column_map;

    function array_flip(trans) {
        var tmp_ar = {};

        for (var key in trans) {
            if (!trans.hasOwnProperty(key)) {
                continue;
            }
            tmp_ar[trans[key]] = key;
        }

        return tmp_ar;
    }

    if(columns instanceof Object) {
        for(var index in columns) {
            if(map[index]) {
                columns[map[index]] = columns[index];
                delete columns[index];
            }
        }
    }

    return columns;
};

AbstractTable.prototype.getRow = function() {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'row']));
}

AbstractTable.prototype.getRowset = function() {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'rowset']));
}

module.exports = AbstractTable;
