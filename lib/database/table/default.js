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
    }

    _initialize(config) {
        var self = this;

        this.table = config.table || this.getIdentifier().getPackage() + '_' + Inflector.pluralize(this.getIdentifier().getName());
        this.db = config.db || this.db;
        this.adapter = RaddishDB.getInstance(this.db);

        return super._initialize(config)
            .then(function(self) {
                return self.getIdentityColumn();
            })
            .then(function(identity_column) {
                self.identity_column = config.identity_column || identity_column;
                self.column_map = config.columnMap || {id: self.identity_column};

                return self;
            });
    }

    getColumns() {
        var columns = this.adapter.getColumns(this.getName());
        return Promise.resolve(columns);
    }

    getIdentityColumn() {
        if(this.identity_column) {
            return this.identity_column;
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
        var map = reverse ? {} : this.column_map;

        if(reverse) {
            var values = [],
                keys = Object.keys(this.column_map);

            for(var index of keys) {
                map[this.column_map[index]] = index;
            }
        }

        return map[key] || key;
    }

    mapColumns(object, reverse) {
        // Parse the object
        for(var index in object) {
            if(object.hasOwnProperty(index)) {
                if(newKey = this.mapColumn(index)) {
                    object[newKey] = object[index];
                    delete object[index];
                }
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
        var object = context.unique ? this.getRow() : this.getRowset()

        return Promise.all([this.adapter.execute(context.query), object])
            .then(function(results) {
                var data = results[0],
                    container = results[1],
                    content = context.unique ? data[0] : data;

                return container.setData(content);
            });
    }

    _actionInsert(context) {
        // We have to create the query ourselves.
    }

    _actionUpdate(context) {

    }

    _actionDelete(context) {

    }
}

module.exports = DefaultTable;