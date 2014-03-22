var ModelAbstract   = require('./abstract');
var async           = require('async');
var squel           = require('squel');
var util            = require('util');

function Model() {
    Model.super_.apply(this, arguments);
};

util.inherits(Model, ModelAbstract);

Model.prototype.initialize = function(config) {
    var defer = Q.defer();
    var self = this;
    self.db = config.db || 'default';

    ModelAbstract.prototype.initialize(config)
        .then(function(model) {
            return self.getTable();
        })
        .then(function(table) {
            return table.getUniqueColumns();
        })
        .then(function(columns) {
            for(index in columns) {
                self.states.insert(columns[index].Field, null, true);
            }

            defer.resolve(self);
        });

    return defer.promise;
};

Model.prototype.getItem = function () {
    var defer = Q.defer();
    var self = this;
    var localTable = undefined;

    if(self.states.isUnique()) {
        self.getTable()
            .then(function(table) {
                localTable = table;
                return table.isConnected()
            })
            .then(function(conneciton) {
                var query = squel.select();
                var def = Q.defer();

                async.waterfall([
                    function (next) {
                        next(null, query, self);
                    },
                    self.buildQueryColumns,
                    self.buildQueryFrom,
                    self.buildQueryJoins,
                    self.buildQueryWhere,
                    self.buildQueryGroup,
                    self.buildQueryHaving,
                    self.buildQueryOrder,
                    self.buildQueryLimit
                ], function(err, query, self) {
                    def.resolve(query);
                });

                return def.promise;
            })
            .then(function(query) {
                return localTable.select(query.toString(), 1);
            })
            .then(function(row) {
                row.new = false;

                defer.resolve(row);
            });
    } else {
        self.getTable()
            .then(function(table) {
                return table.getRow();
            })
            .then(function(row) {
                defer.resolve(row);
            });
    }

    return defer.promise;
};

Model.prototype.getList = function () {
    var defer = Q.defer();
    var self = this;
    var localTable = undefined;
    
    self.getTable()
        .then(function(table) {
            localTable = table;
            return table.isConnected()
        })
        .then(function(conneciton) {
            var query = squel.select();
            var def = Q.defer();

            async.waterfall([
                function (next) {
                    next(null, query, self);
                },
                self.buildQueryColumns,
                self.buildQueryFrom,
                self.buildQueryJoins,
                self.buildQueryWhere,
                self.buildQueryGroup,
                self.buildQueryHaving,
                self.buildQueryOrder,
                self.buildQueryLimit
            ], function(err, query, self) {
                def.resolve(query);
            });

            return def.promise;
        })
        .then(function(query) {
            return localTable.select(query.toString(), 2);
        })
        .then(function(rowset) {
            defer.resolve(rowset);
        });

    return defer.promise;
};

Model.prototype.buildQueryColumns = function (query, self, next) {
    query.field('tbl.*');

    next(null, query, self);
};

Model.prototype.buildQueryFrom = function (query, self, next) {
    self.getTable()
        .then(function(table) {
            query.from(table.getName(), 'tbl');

            next(null, query, self);
        });

    self.getTable(function (table) {
        query.from(table.getName(), 'tbl');

        next(null, query, self);
    });
};

Model.prototype.buildQueryJoins = function (query, self, next) {
    next(null, query, self);
};

Model.prototype.buildQueryWhere = function (query, self, next) {
    var states = self.states.get();

    for(index in states) {
        if(states[index].unique && states[index].value) {
            query.where(index + ' = ?', (states[index].value || states[index].defaultValue));
        }
    }

    next(null, query, self);
};

Model.prototype.buildQueryGroup = function (query, self, next) {
    next(null, query, self);
};

Model.prototype.buildQueryHaving = function (query, self, next) {
    next(null, query, self);
};

Model.prototype.buildQueryOrder = function (query, self, next) {
    var order = self.states.get('sort');
    var direction = self.states.get('direction');

    if(order.value) {
        query.order(order.value, (direction.value == 'asc' ? true : false));
    }

    next(null, query, self);
};

Model.prototype.buildQueryLimit = function (query, self, next) {
    var limit = self.states.get('limit');
    var offset = self.states.get('offset');

    if (limit.value > 0) {
        query.limit(limit.value);
    }

    if (offset.value > 0) {
        query.offset(offset.value);
    }

    next(null, query, self);
};

Model.prototype.getTable = function () {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'table']), {
        db: this.db
    });
};

module.exports = Model;