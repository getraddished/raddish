"use strict";

var Abstract        = require('./abstract'),
    Inflector       = require('../../inflector/inflector'),
    util            = require('util'),
    CommandContext  = require('../../command/context/context');

/**
 * Default table class
 *
 * @class Table
 * @extends TableAbstract
 * @constructor
 */
function Table(config) {
    this._identity_column   = undefined;
    this._column_map        = {};

    Abstract.call(this, config);
}

util.inherits(Table, Abstract);

/**
 * Initialize method to initialize the Table model
 *
 * @method initialze
 * @param {Object|null} config Config object for the Table object
 * @returns {Promise} The initialized Table object
 */
Table.prototype.initialize = function (config) {
    var self = this;
    var extra = this.getComponentConfig('table.' + this.getIdentifier().getName());

    this._identity_column = config.identity_column || extra.identity_column || null;
    this._column_map = config.column_map || {};

    this.db = config.db || extra.db || 'default';
    this.db_config = self.getConfig('db')[this.db];
    this.adapter = this.db_config.type || 'mysql';
    this.name = (self.db_config.prefix || '') + (config.name || extra.name || self.getIdentifier().getPackage() + '_' + Inflector.pluralize(self.getIdentifier().getName()));
    this.filters = config.filters || extra.filters || {};

    config.behaviors = config.behaviors || extra.behaviors || {};

    if(this.db_config === undefined) {
        throw new RaddishError(500, 'No config found for the ' + this.db + ' database adapter');
    }

    return Table.super_.prototype.initialize.call(self, config)
        .then(function () {
            // Now we will set the identity column.
            return self.getIdentityColumn();
        })
        .then(function (identity_column) {
            self._identity_column = self._identity_column || identity_column;

            if (!self._column_map.id && self._identity_column) {
                self._column_map.id = self._identity_column;
            }

            return self;
        });
};

/**
 * This method tries to get get a row or rowset from the table.
 *
 * @method select
 * @param {String} query
 * @param {Int} mode Mode to get from the table.
 * @returns {Promise} The data requested from the database.
 */
Table.prototype.select = function (query, mode) {
    var context     = new CommandContext();
    context.data    = undefined;
    context.table   = this.getName();
    context.query   = query;
    context.mode    = mode;

    return this.execute('select', context);
};

Table.prototype._beforeSelect = function(context) {
    return context;
};

Table.prototype._afterSelect = function(context) {
    var self = this;
    var object = undefined;

    if(context.mode === 1) {
        object = this.getRow();
    } else if(context.mode === 2) {
        object = this.getRowset();
    } else if(context.mode === 3) {
        object = Promise.cast({});
    } else {
        throw new RaddishError(500, 'Unrecognised select mode.');
    }

    return object
        .then(function(object) {
            if(context.mode === 1) {
                context.result = self.mapColumns(context.result[0], true);
            } else if(context.mode === 2) {
                for(var index in context.result) {
                    context.result[index] = self.mapColumns(context.result[index], true);
                }
            } else if(context.mode === 3) {
                for(var index in context.result) {
                    context.result[index] = self.mapColumns(context.result[index], true);
                }

                return context.result;
            }

            return object.setData(context.result);
        })
        .then(function(object) {
            if(context.mode === 1 && object.getData().id !== null) {
                object.new = false;
            } else if(context.mode === 2 && object.getData().length > 0) {
                for(var index in object.rows) {
                    if(object.rows.hasOwnProperty(index)) {
                        object.rows[index].new = false;
                    }
                }
            }

            context.result = object;
            return context;
        });
};

/**
 * This method will try to insert a row in the database
 *
 * @method insert
 * @param {Row} row The row object to insert in the database.
 * @return {Promise} The inserted data.
 */
Table.prototype.insert = function (row) {
    var self = this;

    var context     = new CommandContext();
    context.data    = row;
    context.table   = this.getName();
    context.query   = undefined;

    return this.getQuery()
        .then(function(query) {
            context.query = query.insert();

            return self.execute('insert', context);
        });
};

Table.prototype._beforeInsert = function(context) {
    var self = this;

    return this.getAdapter()
        .then(function(adapter) {
            return self.getColumns()
                .then(function(columns) {
                    context.query.table(context.table);

                    self.filter(adapter, columns, context.data.data);

                    for(var index in context.data.data) {
                        if((adapter.strictColumns ? columns[index] : true) && (adapter.strictColumns ? !columns[index].autoinc : true) && (adapter.strictColumns ? context.data.data[index] : true)) {
                            context.query.set((adapter.strictColumns ? columns[index].name : index), context.data.data[index]);
                        }
                    }

                    return context;
                });
        });
};

Table.prototype._afterInsert = function(context) {
    context.data.data = this.mapColumns(context.data.data, true);
    context.data.new = false;

    context.data.data.id = context.result.insertId;
    context.result = context.data;

    return context;
};

/**
 * This method will try to update a row in the database.
 *
 * @method update
 * @param {Row} row The row object to update.
 * @return {Promise} The updated data.
 */
Table.prototype.update = function (row) {
    var self = this;

    var context     = new CommandContext();
    context.data    = row;
    context.table   = this.getName();
    context.query   = undefined;

    return this.getQuery()
        .then(function(query) {
            context.query = query.update();

            return self.execute('update', context);
        });
};

Table.prototype._beforeUpdate = function(context) {
    var self = this;

    return this.getAdapter()
        .then(function(adapter) {
            return self.getColumns()
                .then(function(columns) {
                    context.query.table(context.table);

                    // Here we filter both modified and data, this is because the data put into modified will also be put in data.
                    self.filter(adapter, columns, context.data.modified);
                    self.filter(adapter, columns, context.data.data);

                    for(var index in context.data.modified) {
                        if((adapter.strictColumns ? columns[index] : true) && (adapter.strictColumns ? !columns[index].autoinc : true) && (adapter.strictColumns ? context.data.data[index] !== false : true)) {
                            context.query.set((adapter.strictColumns ? columns[index].name : index), context.data.modified[index]);
                        }
                    }

                    for(var index in columns) {
                        if(columns[index].unique && context.data.data[index] && !context.data.modified[index]) {
                            context.query.where(columns[index].name, '=', context.data.data[index]);
                        }
                    }

                    return context;
                });
        });
};

Table.prototype._afterUpdate = function(context) {
    context.data.data = this.mapColumns(context.data.data, true);
    context.result = context.data;

    return context;
};

/**
 * This method will try to delete a row in the database.
 *
 * @method delete
 * @param {Row} row The row object to delete.
 * @return {Promise} The deleted data.
 */
Table.prototype.delete = function (row) {
    var self = this;

    var context     = new CommandContext();
    context.data    = row;
    context.table   = this.getName();
    context.query   = undefined;

    return this.getQuery()
        .then(function(query) {
            context.query = query.delete();

            return self.execute('delete', context);
        });
};

Table.prototype._beforeDelete = function(context) {
    return this.getUniqueColumns()
        .then(function(columns) {
            context.query.table(context.table);

            for(var index in columns) {
                context.query.where(columns[index].name, '=', context.data.data[index]);
            }

            return context;
        });
};

Table.prototype._afterDelete = function(context) {
    context.result = this.mapColumns(context.data, true);

    return context;
};

/**
 * This function will filter the data based on the columns.
 * And will check if the value is correct.
 *
 * @method filter
 * @param {Object} adapter The adapter object.
 * @param {Object} columns The object containing all the columns.
 * @param {Object} data The data object.
 * @private
 */
Table.prototype.filter = function(adapter, columns, data) {
    var strict = adapter.strictColumns;

    for(var index in data) {
        if((strict ? columns[index] : false) && columns[index].filter.validate(data[index])) {
            data[index] = columns[index].filter.sanitize(data[index]);
        } else if(strict && !columns[index]) {
            // If everything is ok this is a pointer.
            delete data[index];
        }
    }
};

/**
 * The getQuery method returns the query received from the associated adapter (default: mysql).
 *
 * @method getQuery
 * @returns {Object} The queryBuilder object.
 */
Table.prototype.getQuery = function() {
    return this.getAdapter()
        .then(function(adapter) {
            return adapter.getQuery();
        });
};

module.exports = Table;
