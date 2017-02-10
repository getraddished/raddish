'use strict';

var AbstractTable = require('./abstract'),
    RaddishDB = require('raddish-db'),
    Inflector = require('raddish-inflector');

class DefaultTable extends AbstractTable {
    constructor(config) {
        super(config);

        this.table = '';
        this.db = 'default';
        this.adapter = null;
        this.column_map = null;
        this.identityColumn = '';
    }

    _initialize(config) {
        var self = this;

        this.table = config.table || this.getIdentifier().getPackage() + '_' + Inflector.pluralize(this.getIdentifier().getName());
        this.db = config.db || this.db;
        this.adapter = RaddishDB.getInstance(this.db);

        return super._initialize(config)
            .then(function() {
                return self.getIdentityColumn();
            })
            .then(function(identityColumn) {
                self.identityColumn = config.identityColumn || identityColumn;
                self.column_map = config.columnMap || {id: self.identityColumn};

                return self;
            });
    }

    getColumns() {
        var columns = this.adapter.getColumns(this.getName());
        return Promise.resolve(columns);
    }

    getIdentityColumn() {
        if(this.identityColumn) {
            return this.identityColumn;
        }

        return this.getUniqueColumns()
            .then(function(columns) {
                for(var column of columns) {
                    if(column.autoinc) {
                        return column.name;
                    }
                }

                return false;
            });
    }

    getName() {
        return this.table;
    }

    mapColumn(key, reverse) {
        var map = reverse ? {} : this.column_map,
            keys = Object.keys(this.column_map);

        if(reverse) {
            for(var index of keys) {
                map[this.column_map[index]] = index;
            }
        }

        return map[key] || key;
    }

    mapColumns(object) {
        var newKey = '';

        for(var key of object) {
            newKey = this.mapColumn(key);

            if(newKey) {
                object[newKey] = object[key];
                delete object[key];
            }
        }

        return object;
    }

    /**
     * This method will try to select data from a data source.
     *
     * @param {CommandContext} context The context of the select action.
     * @private
     */
    _actionSelect(context) {
        var object = context.unique ? this.getRow() : this.getRowset();

        return Promise.all([this.adapter.execute(context.query), object])
            .then(function(results) {
                var data = results[0],
                    container = results[1],
                    content = context.unique ? data[0] : data;

                return container.setData(content);
            })
            .then(function(container) {
                container.isNew(false);

                return container;
            });
    }

    _actionInsert(context) {
        var self = this;

        return this.adapter.execute(context.query)
            .then(function(result) {
                context.row.data.id = self.adapter.getInsertedId(result);

                return result;
            });
    }

    _actionUpdate(context) {
        return this.adapter.execute(context.query);
    }

    _actionDelete(context) {
        return this.adapter.execute(context.query);
    }
}

module.exports = DefaultTable;