'use strict';

var AbstractTable = require('./abstract'),
    RaddishDB = require('raddish-db'),
    Inflector = require('raddish-inflector');

/**
 * This table object contains all the database related methods.
 *
 * @class DefaultTable
 */
class DefaultTable extends AbstractTable {
    constructor(config) {
        super(config);

        this.table = '';
        this.db = 'default';
        this.column_map = null;
        this.identityColumn = '';
    }

    _initialize(config) {
        var self = this;

        this.table = config.table || this.getIdentifier().getPackage() + '_' + Inflector.pluralize(this.getIdentifier().getName());
        this.db = config.db || this.db;

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

    /**
     * This method will query the database to get all the columns.
     *
     * @return {Promise} A promise containing the columns of the table.
     */
    getColumns() {
        return this.getAdapter().getColumns(this.getName());
    }

    /**
     * This method will return the identityColumn of the database,
     * by default the autoIncrement column will be marked as IdentityColumn.
     *
     * However this can be overridden by configuring a defined IdentityColumn.
     *
     * @return {String|false} A string containing the identityColumn will be returned, false if no identityColumn can be found.
     */
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

    /**
     * This method will return the name of the table.
     *
     * @return {String} The name of the table in string form.
     */
    getName() {
        return this.table;
    }

    /**
     * This method check for the column name of the given key, or reversed.
     *
     * @param {String} key The column name to return.
     * @param {Boolean} reverse Reverse the method. (default: false)
     * @return {String} The new name of the object key.
     */
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

    getAdapter() {
        return RaddishDB.getInstance(this.db);
    }

    /**
     * This method will rename object keys to their new key when found.
     *
     * @param {Object} object The object to rename the keys of.
     * @param {Boolean} reverse A boolean to reverse the functionality.
     * @return {Object} The object with the renamed keys.
     */
    mapColumns(object, reverse) {
        var newKey = '';

        for(var key of object) {
            newKey = this.mapColumn(key, reverse);

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

        return Promise.all([this.getAdapter().execute(context.query), object])
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

        return this.getAdapter().execute(context.query)
            .then(function(result) {
                context.row.data.id = self.adapter.getInsertedId(result);

                return result;
            });
    }

    _actionUpdate(context) {
        return this.getAdapter().execute(context.query);
    }

    _actionDelete(context) {
        return this.getAdapter().execute(context.query);
    }
}

module.exports = DefaultTable;