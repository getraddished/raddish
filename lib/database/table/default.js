'use strict';

var AbstractTable = require('./abstract'),
    RaddishDB = require('raddish-db'),
    Inflector = require('inflected');

/**
 * The DefaultTable class holds all methods related to the database.
 * All the data this class works with are also stored in a database.
 *
 * @class DefaultTable
 */
class DefaultTable extends AbstractTable {
    constructor(config) {
        super(config);

        this.table = '';
        this.db = 'default';
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
     * @method getColumns
     * @return {Promise} A promise containing the columns of the table.
     */
    getColumns() {
        var self = this;

        if(this.related['columns']) {
            return Promise.resolve(this.related.columns.map(function(column) {
                column.name = self.mapColumn(column.name, true);

                return column;
            }));
        }

        return this.getAdapter().getColumns(this.getName())
            .then(function(columns) {
                self.related.columns = columns;

                return columns.map(function(column) {
                    column.name = self.mapColumn(column.name, true);

                    return column;
                });
            });
    }

    /**
     * This method will return the identityColumn of the database,
     * by default the autoIncrement column will be marked as IdentityColumn.
     *
     * However this can be overridden by configuring a defined IdentityColumn.
     *
     * @method getIdentityColumn
     * @return {String|false} A string containing the identityColumn will be returned, false if no identityColumn can be found.
     */
    getIdentityColumn() {
        var self = this;

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
     * @method getName
     * @return {String} The name of the table in string form.
     */
    getName() {
        return this.table;
    }

    /**
     * This method will try to select data from a data source.
     *
     * @method _actionSelect
     * @param {CommandContext} context The context of the select action.
     * @private
     */
    _actionSelect(context) {
        var object = context.unique ? this.getRow() : this.getRowset(),
            self = this;

        return Promise.all([this.getAdapter().execute(context.query), object])
            .then(function(results) {
                var data = results[0],
                    container = results[1],
                    content = context.unique ? data[0] : data;

                content = self.mapColumns(content, true);
                return container.setData(content);
            })
            .then(function(container) {
                container.isNew(false);

                return container;
            });
    }

    /**
     * Override for the insert action.
     *
     * @method _actionInsert
     * @param context
     * @return {Promise<TResult>|Promise.<TResult>}
     * @private
     */
    _actionInsert(context) {
        var self = this;

        return this.getAdapter().execute(context.query)
            .then(function(result) {
                context.row.data.id = self.getAdapter().getInsertedId(result);

                return result;
            });
    }

    /**
     * Override for the update method
     *
     * @method _actionUpdate
     * @param context
     * @return {Promise|*|CommandContext}
     * @private
     */
    _actionUpdate(context) {
        return this.getAdapter().execute(context.query);
    }

    /**
     * Override for the delete action
     *
     * @method _actionDelete
     * @param context
     * @return {Promise|*|CommandContext}
     * @private
     */
    _actionDelete(context) {
        return this.getAdapter().execute(context.query);
    }
}

module.exports = DefaultTable;