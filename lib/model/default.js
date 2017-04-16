'use strict';

var AbstractModel = require('./abstract');

/**
 * The DefaultModel class holds all the methods which relate to the database
 *
 * @class DefaultModel
 * @extends AbstractModel
 */
class DefaultModel extends AbstractModel {
    constructor(config) {
        super(config);

        this.state.insert('limit', 'int', false, 20);
        this.state.insert('offset', 'int', false, 0);
        this.state.insert('sort', 'string');
        this.state.insert('direction', 'string');
    }

    /**
     * The getItem method of the DefaultModel will build a query for the database.
     *
     * The methods called to build the query are:
     * - _buildQueryFrom
     * - _buildQueryColumns
     * - _buildQueryJoins
     * - _buildQueryWhere
     * - _buildQueryGroup
     * - _buildQueryHaving
     *
     * @method getItem
     * @return {Promise} A promise containing a row object with data from the database.
     */
    getItem() {
        // Check if the query is unique, else return an empty row object
        if(!this.state.isUnique()) {
            return this.getTable()
                .then(function(table) {
                    return table.getRow();
                });
        }

        var self = this;
        return this.getTable()
            .then(function(table) {
                var query = table.getQuery().select();

                return Promise.resolve(query)
                    .then(self._buildQueryFrom.bind(self))
                    .then(self._buildQueryColumns.bind(self))
                    .then(self._buildQueryJoins.bind(self))
                    .then(self._buildQueryWhere.bind(self))
                    .then(self._buildQueryGroup.bind(self))
                    .then(self._buildQueryHaving.bind(self));
            })
            .then(function(query) {
                return self.getTable()
                    .then(function(table) {
                        return table.execute('select', {
                            query: query,
                            unique: true
                        });
                    });
            });
    }

    /**
     * The getList method will build a query for the database.
     * This method will always return a Rowset object with data from the database.
     *
     * The methods called to build the query are:
     * - _buildQueryFrom
     * - _buildQueryColumns
     * - _buildQueryJoins
     * - _buildQueryWhere
     * - _buildQueryGroup
     * - _buildQueryHaving
     * - _buildQueryOrder
     * - _buildQueryLimit
     *
     * @method getList
     * @return {Promise} A promise containing a Rowset object with data from the database.
     */
    getList() {
        var self = this;

        return this.getTable()
            .then(function(table) {
                var query = table.getQuery().select();

                return Promise.resolve(query)
                    .then(self._buildQueryFrom.bind(self))
                    .then(self._buildQueryColumns.bind(self))
                    .then(self._buildQueryJoins.bind(self))
                    .then(self._buildQueryWhere.bind(self))
                    .then(self._buildQueryGroup.bind(self))
                    .then(self._buildQueryHaving.bind(self))
                    .then(self._buildQueryOrder.bind(self))
                    .then(self._buildQueryLimit.bind(self));
            })
            .then(function(query) {
                return self.getTable()
                    .then(function(table) {
                        return table.execute('select', {
                            query: query,
                            unique: false
                        });
                    });
            });
    }

    /**
     * This method is used to specify from which table the data needs to come.
     *
     * @method _buildQueryFrom
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryFrom(query) {
        return this.getTable()
            .then(function(table) {
                query.from(table.getName(), 'tbl');

                return query;
            });
    }

    /**
     * In this method the specific functions to select the columns can be added.
     *
     * @method _buildQueryColumns
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryColumns(query) {
        query.select('tbl.*');

        return query;
    }

    /**
     * This method will hold the specific calls for the Join methods.
     *
     * @method _buildQueryJoins
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryJoins(query) {
        return query;
    }

    /**
     * This method will hold all the functionality to add the Where clause to the query.
     * By default filled unique states are added to the query.
     *
     * @method _buildQueryWhere
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryWhere(query) {
        var states = this.state.states;

        return this.getTable()
            .then(function(table) {

                for(var index in states) {
                    if(states.hasOwnProperty(index)) {
                        var state = states[index];
                        if(state.unique && state.value) {
                            if(Array.isArray(state.value)) {
                                query.where('tbl.' + table.mapColumn(index)).in(state.value);
                            } else {
                                query.where('tbl.' + table.mapColumn(index)).is(state.value);
                            }
                        }
                    }
                }

                return query;
            });
    }

    /**
     * The _buildQueryGroup method will hold all the functions to specify the group clauses.
     * By default no group is added.
     *
     * @method _buildQueryGroup
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryGroup(query) {
        return query;
    }

    /**
     * The _buildQueryGroup method will hold all the functions to specify the having clauses.
     * By default no having is added.
     *
     * @method _buildQueryHaving
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryHaving(query) {
        return query;
    }

    /**
     * The _buildQueryOrder method will hold all the functions to specify the ordering done on the data.
     * When the order and direction states have been set the values will be added to the query.
     *
     * @method _buildQueryOrder
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryOrder(query) {
        var order = this.state.get('order'),
            direction = this.state.get('direction');

        if(order) {
            query.order(order, direction);
        }

        return query;
    }

    /**
     * The _buildQueryLimit method will hold all the functions to specific for the limit and offset.
     * When the limit and offset states have been set the values will be added to the query.
     *
     * @method _buildQueryLimit
     * @param {SelectQuery} query The select query from RaddishDB.
     * @return {Promise} A promise containing the query object.
     * @private
     */
    _buildQueryLimit(query) {
        var limit = this.state.get('limit'),
            offset = this.state.get('offset');

        if(limit) {
            query.limit(limit);

            if(offset) {
                query.offset(offset);
            }
        }

        return query;
    }
}

module.exports = DefaultModel;