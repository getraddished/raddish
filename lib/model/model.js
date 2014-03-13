var ModelAbstract   = require('./abstract');
var async           = require('async');
var squel           = require('squel');
var util            = require('util');

function Model() {
    Model.super_.apply(this, arguments);
};

util.inherits(Model, ModelAbstract);

Model.prototype.initialize = function(config, callback) {
    var self = this;
    
    Model.super_.prototype.initialize.call(this, config, function (done) {
        self.db = config.db || 'default';
        
        self.getTable(function (table) {
            table.getUniqueColumns(function (columns) {
                for(index in columns) {
                    self.states.insert(columns[index].Field, null, true);
                }
                
                callback(null);
            });
        });
    });
};

Model.prototype.getItem = function (callback) {
    var self = this;
    
    this.getTable(function (table) {
        if(self.states.isUnique()) {
            table.isConnected(function (err, connection) {
                if(err) {
                    callback(err, null);
                } else {
                    var query = squel.select();

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
                        self.getTable(function (table) {
                            table.select(query.toString(), 1, function (err, row) {
                                callback(err, row);
                            });
                        });
                    });
                }
            });
        } else {
            table.getRow(function(row) {
                callback(null, row);
            });
        }

    });
};

Model.prototype.getList = function (callback) {
    var self = this;
    
    this.getTable(function (table) {    
        table.isConnected(function (err, connection) {
            if(err) {
                callback(err, null);
            } else {
                var query = squel.select();
                
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
                    self.getTable(function (table) {
                        table.select(query.toString(), 2, function (err, rowset) {
                            callback(err, rowset);
                        });
                    });
                });
            }
        });
    });
};

Model.prototype.buildQueryColumns = function (query, self, next) {
    query.field('tbl.*');

    next(null, query, self);
};

Model.prototype.buildQueryFrom = function (query, self, next) {
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

Model.prototype.getTable = function (callback) {
    var identifier = this.getIdentifier().clone();

    this.getObject(identifier.setPath(['database', 'table']), {
        db: this.db
    }, callback);
};

module.exports = Model;