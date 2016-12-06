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
    }

    _initialize(config) {
        this.identity_column = config.identity_column || null;
        this.table = config.table || this.identifier.getPackage() + '_' + Inflector.pluralize(this.identifier.getName());
        this.db = config.db || this.db;
        this.adapter = RaddishDB.getInstance(this.db);

        return super._initialize(config);
    }

    getColumns() {
        return Promise.resolve(this.adapter.getColumns());
    }

    getIdentityColumn() {
        if(this.identity_column) {
            return this.identity_column;
        }

        return this.getUniqueColumns()
            .then(function(columns) {
                for(var index of columns) {
                    if(columns[index].autoinc) {
                        return columns[index];
                    }
                }

                return false;
            });
    }

    getName() {
        return this.table;
    }

    /**
     * This method will try to select data from a data source.
     *
     * @param {CommandContext} context The context of the select action.
     * @private
     */
    _actionSelect(context) {
        return Promise.all([this.adapter.execute(context.query), this.getRowset()])
            .then(function(results) {
                var data = results[0],
                    rowset = results[1];

                return rowset.setData(data);
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