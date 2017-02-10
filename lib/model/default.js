'use strict';

var AbstractModel = require('./abstract');

class DefaultModel extends AbstractModel {
    constructor(config) {
        super(config);

        this.state.insert('limit', 20);
    }

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
                var query = table.getQueryBuilder().select();

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

    getList() {
        var self = this;

        return this.getTable()
            .then(function(table) {
                var query = table.getQueryBuilder().select();

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

    _buildQueryFrom(query) {
        return this.getTable()
            .then(function(table) {
                query.from(table.getName(), 'tbl');

                return query;
            });
    }

    _buildQueryColumns(query) {
        query.select('tbl.*');

        return query;
    }

    _buildQueryJoins(query) {
        return query;
    }

    _buildQueryWhere(query) {
        var states = this.state.states;

        return this.getTable()
            .then(function(table) {

                for(var index in states) {
                    if(states.hasOwnProperty(index)) {
                        var state = states[index];

                        if(state.unique && state.value) {
                            query.where('tbl.' + table.mapColumn(index)).is(state.value);
                        }
                    }
                }

                return query;
            });
    }

    _buildQueryGroup(query) {
        return query;
    }

    _buildQueryHaving(query) {
        return query;
    }

    _buildQueryOrder(query) {
        var order = this.state.get('order'),
            direction = this.state.get('direction');

        if(order) {
            query.order(order, direction);
        }

        return query;
    }

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