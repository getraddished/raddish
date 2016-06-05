"use strict";

var Abstract        = require('./abstract'),
    Inflector       = require('../../inflector/inflector'),
    util            = require('util');

/**
 * The default table object handles all "database" related things.
 *
 * @class Table
 * @param {Object} config The config object
 * @constructor
 */
function Table(config) {
    Abstract.call(this, config);

    this.methods = ['select', 'insert', 'update', 'delete'];
    this.adapter = null;
}

util.inherits(Table, Abstract);

Table.prototype.initialize = function(config) {
    var self = this;

    this.adapter_name = config.db || 'default';
    this.adapter_config = Raddish.getConfig('db.' + this.adapter_name);
    this.adapter = this.adapter_config.type || 'mysql';

    config.name = (this.adapter_config.prefix ? this.adapter_config.prefix : '') + (config.name || this.getIdentifier().getPackage() + '_' + Inflector.pluralize(this.getIdentifier().getName()));

    return Abstract.prototype.initialize.call(this, config)
        .then(function() {
            return self.getIdentityColumn();
        })
        .then(function(column) {
            self._identity_column = column.name || config.identity_column;

            if(!self._column_map['id']) {
                self._column_map['id'] = self._identity_column;
            }

            return self;
        });
};

/**
 * getColumns override for database purposex.
 *
 * @return {Promise} Promise containing all the columns.
 */
Table.prototype.getColumns = function() {
    var columns = Abstract.prototype.getColumns.call(this),
        self = this;

    if(Object.keys(columns).length) {
        return Promise.resolve(columns);
    }

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

            self._columns = columns;
            return Abstract.prototype.getColumns.call(self);
        });
};

/**
 * getIdentityColumn override for database purposes.
 *
 * @return {Promise} Promise containing the identityColumn.
 */
Table.prototype.getIdentityColumn = function() {
    return this.getColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns.hasOwnProperty(index)) {
                    var column = columns[index];

                    if(column.autoinc && column.unique) {
                        return column;
                    }
                }
            }
        });
};

Table.prototype._actionSelect = function(context) {
    var self = this;

    return this.getAdapter()
        .then(function(adapter) {
            return adapter.execute(context.getProperty('query'));
        })
        .then(function(result) {
            var object = null,
                data = null,
                mode = context.getProperty('mode');

            if(mode === 2) {
                object = self.getRowset();
                data = [];

                for(var index in result) {
                        data.push(self.mapColumns(result[index], true));
                }
            } else if(mode === 1) {
                object = self.getRow();
                data = self.mapColumns(result[0], true);
            }

            return object
                .then(function(obj) {
                    return obj.setData(data);
                })
                .then(function(obj) {
                    if(mode === 2) {
                        for(var index in obj.rows) {
                            if(obj.rows.hasOwnProperty(index)) {
                                obj.rows[index].new = false;
                            }
                        }
                    } else if(mode === 1) {
                        obj.new = false;
                    }

                    return obj;
                });
        });
};

/**
 * Insert Action to insert data into the database.
 *
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
Table.prototype._actionInsert = function(context) {
    var self = this

    return this.getAdapter()
        .then(function(adapter) {
            return adapter.getQuery()
                .then(function(query) {
                    context.setProperty('query', query.insert());
                    context.getProperty('query').table(self.getName());

                    return context;
                })
                .then(function(context) {
                    return self.getColumns()
                        .then(function(columns) {
                            self.filter(adapter, columns, context.getProperty('row').data);

                            for(var index in context.getProperty('row').data) {
                                if((adapter.strictColumns ? columns[index] : true) && (adapter.strictColumns ? !columns[index].autoinc : true) && (adapter.strictColumns ? context.getProperty('row').data[index] : true)) {
                                    context.getProperty('query').set((adapter.strictColumns ? columns[index].name : index), context.getProperty('row').data[index]);
                                }
                            }

                            return context;
                        });
                });
        })
        .then(function(context) {
            // Build the query
            return adapter.execute(context.getProperty('query'));
        })
        .then(function(result) {
            
        });
};

Table.prototype._actionUpdate = function(context) {

};

Table.prototype._actionDelete = function(context) {

};

module.exports = Table;
