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
        this.table = config.table || Inflector.pluralize(this.getIdentifier().getName());
        this.db = config.db || this.db;
        this.adapter = Raddish.getInstance(this.db);

        return super._initialize(config);
    }

    getColumns() {
        return this.adapter.getColumns();
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

    /**
     * This method will try to select data from a data source.
     *
     * @param {CommandContext} context The context of the select action.
     * @private
     */
    _actionSelect(context) {
        return this.adapter.execute(context.query)
            .then(function(result) {
                console.log(result);
            });
    }
}

module.exports = DefaultTable;