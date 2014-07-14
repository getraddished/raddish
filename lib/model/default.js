"use strict";

var ModelAbstract   = require('./abstract');
var util            = require('util');
var Inflector       = require('../inflector/inflector');
var clone           = require('clone');

function Model(config) {
    this.table = undefined;

    Model.super_.call(this, config);
};

util.inherits(Model, ModelAbstract);

Model.prototype.initialize = function (config) {
    var self = this;

    return Model.super_.prototype.initialize.call(self, config)
        .then(function (model) {
            return self.getTable();
        })
        .then(function (table) {
            return table.getUniqueColumns();
        })
        .then(function (columns) {
            for(var index in columns) {
                self.states.insert(index, columns[index].type, null, true);
            }

            return self;
        });
};

Model.prototype.getItem = function () {
    var self = this;

    return Model.super_.prototype.getItem.call(this)
        .then(function() {
            if(self.states.isUnique()) {
                return self.getTable()
                    .then(function (table) {
                        return [table.getQuery(), table];
                    })
                    .spread(function(query, table) {
                        return Promise.cast([query.select(), self])
                            .spread(self.buildQueryColumns)
                            .spread(self.buildQueryFrom)
                            .spread(self.buildQueryJoins)
                            .spread(self.buildQueryWhere)
                            .spread(self.buildQueryGroup)
                            .spread(self.buildQueryHaving)
                            .spread(self.buildQueryOrder)
                            .spread(self.buildQueryLimit)
                            .spread(function(query, self) {
                                return [query, table];
                            });
                    })
                    .spread(function (query, table) {
                        return table.select(query, 1);
                    });
            } else {
                return self.getTable()
                    .then(function (table) {
                        return table.getRow();
                    });
            }
        });
};

Model.prototype.getList = function () {
    var self = this;

    return Model.super_.prototype.getList.call(this)
        .then(function() {
            return self.getTable()
        })
        .then(function (table) {
            return [table.getQuery(), table];
        })
        .spread(function (query, table) {
            return Promise.cast([query.select(), self])
                .spread(self.buildQueryColumns)
                .spread(self.buildQueryFrom)
                .spread(self.buildQueryJoins)
                .spread(self.buildQueryWhere)
                .spread(self.buildQueryGroup)
                .spread(self.buildQueryHaving)
                .spread(self.buildQueryOrder)
                .spread(self.buildQueryLimit)
                .spread(function(query, self) {
                    return [query, table];
                });
        })
        .spread(function (query, table) {
            return table.select(query, 2);
        });
};

Model.prototype.getTotal = function () {
    var self = this;

    return Model.super_.prototype.getList.call(this)
        .then(function() {
            return self.getTable()
        })
        .then(function (table) {
            return [table.getQuery(), table];
        })
        .spread(function (query, table) {
            return Promise.cast([query.select(), self])
                .spread(self.buildQueryColumns)
                .spread(self.buildQueryFrom)
                .spread(self.buildQueryJoins)
                .spread(self.buildQueryWhere)
                .spread(self.buildQueryGroup)
                .spread(self.buildQueryHaving)
                .spread(self.buildQueryOrder)
                .spread(function(query, self) {
                    return [query, table];
                });
        })
        .spread(function (query, table) {
            return table.select(query, 2);
        })
        .then(function(data) {
            return data.rows.length;
        });
};

Model.prototype.buildQueryColumns = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryFrom = function (query, self) {
    return self.getTable()
        .then(function(table) {
            query.table(table.getName(), 'tbl');

            return [query, self];
        });
};

Model.prototype.buildQueryJoins = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryWhere = function (query, self) {
    var states = clone(self.states.get());

    return self.getTable()
        .then(function(table) {

            states = table.mapColumns(states);
            for(var index in states) {
                if (states[index].unique && states[index].value) {
                    query.where(index, '=', (states[index].value || states[index].defaultValue));
                }
            }

            return [query, self];
        });
};

Model.prototype.buildQueryGroup = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryHaving = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryOrder = function (query, self) {
    var order = self.states.get('sort');
    var direction = self.states.get('direction');

    if(order.value) {
        query.order(order.value, (direction.value || direction.defaultValue));
    }

    return [query, self];
};

Model.prototype.buildQueryLimit = function (query, self) {
    var limit = self.states.get('limit');
    var offset = self.states.get('offset');

    if (limit.value > 0) {
        query.limit(limit.value);
    }

    if (offset.value > 0) {
        query.offset(offset.value);
    }

    return [query, self];
};

Model.prototype.getTable = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return self.getObject(identifier.setPath(['database', 'table']).setName(Inflector.singularize(identifier.getName())))
        .then(function(table) {
            return table;
        });
};

module.exports = Model;