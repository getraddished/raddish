var ModelAbstract   = require('./abstract');
var async           = require('async');
var util            = require('util');

function Model() {
    this.table = undefined;

    Model.super_.apply(this, arguments);
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
                        self.states.insert(index, null, true);
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
                        return Promise.resolve([query.select(), self])
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
                    })
                    .then(function (row) {
                        row.new = false;

                        return row;
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
            return Promise.resolve([query.select(), self])
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

Model.prototype.buildQueryColumns = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryFrom = function (query, self) {
    return self.getTable()
            .then(function(table) {
                query.from(table.getName(), 'tbl');

                return [query, self];
            });
};

Model.prototype.buildQueryJoins = function (query, self) {
    return [query, self];
};

Model.prototype.buildQueryWhere = function (query, self) {
    var states = self.states.get();

    return self.getTable()
        .then(function(table) {

            states = table.mapColumns(JSON.parse(JSON.stringify(states)));
            for(var index in states) {
                if (states[index].unique && states[index].value) {
                    query.where(index + ' = ?', (states[index].value || states[index].defaultValue));
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
        query.order(order.value, (direction.value == 'asc' ? true : false));
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

    return new Promise(function(resolve, reject) {
        if(self.table !== undefined) {
            resolve(self.table);
        } else {
            self.getService(identifier.setPath(['database', 'table']), {
                    db: self.db
                })
                .then(function(table) {
                    self.table = table;
                    resolve(table);
                });
        }
    });
};

module.exports = Model;