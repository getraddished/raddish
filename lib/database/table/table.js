var Base      = require('../../base/base');
var Database    = require('../database');
var Inflector   = require('../../inflector/inflector');
var util        = require('util');

function Table() {
    this.columns = undefined;
}

util.inherits(Table, Base);

Table.prototype.initialize = function (config) {
    var self = this;
    var defer = Q.defer();

    Base.prototype.initialize(config)
        .then(function(table) {
            self.db = config.db;
            self.db_config = self.getConfig('db')[config.db];
            self.name = self.getIdentifier().getComponent() + '_' + Inflector.pluralize(self.getIdentifier().getName());

            defer.resolve(self);
        })

    return defer.promise;
};

Table.prototype.getName = function () {
    return this.name;
};

Table.prototype.select = function (query, mode) {
    var defer = Q.pending();
    var self = this;
    var localData = undefined;

    self.isConnected()
        .then(function(connection) {
            var def = Q.pending();
            connection.query(query, function(err, data) {
                def.resolve(data);
            });

            return def.promise;
        })
        .then(function(data) {
            if(mode === 1) {
                return [self.getRow(), data];
            } else if(mode === 2) {
                return [self.getRowset(), data];
            }
        })
        .spread(function(object, data) {
            if(mode === 1) {
                return object.setData(data[0]);
            } else if(mode === 2) {
                return object.setData(data);
            }
        })
        .then(function(object) {
            defer.resolve(object);
        })
        .catch(function(err) {
            console.log(err);
        });

    return defer.promise;
};

/**
 * Like UDP fire and pray ;)
 */
Table.prototype.insert = function (query) {
    var defer = Q.pending();
    var self = this;

    self.isConnected()
        .then(function(connection) {
            connection.query(query.toString(), function(err, row) {
                defer.resolve(row);
            });
        });
    
    return defer.promise;
};

Table.prototype.update = function (query) {
    var defer = Q.pending();
    var self = this;

    self.isConnected()
        .then(function(connection) {
            connection.query(query.toString(), function(err, row) {
                defer.resolve(row);
            });
        });
    
    return defer.promise;
};

Table.prototype.delete = function (query) {
    var defer = Q.pending();
    var self = this;

    self.isConnected()
        .then(function(connection) {
            connection.query(query.toString(), function(err, row) {
                defer.resolve(row);
            });
        });
    
    return defer.promise;
};

Table.prototype.isConnected = function () {
    var defer = Q.pending();
    var self = this;

    Database.getInstance(self.db, self.db_config)
        .then(function (connection) {
            if(!connection) {
                reject({
                    error: 500,
                    message: 'Unable to connecto to database'
                });
            } else {
                defer.resolve(connection);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    
    return defer.promise;
};

Table.prototype.getRow = function (callback) {
    var self = this;
    var identifier = this.getIdentifier().clone();
    
    return this.getObject(identifier.setPath(['database', 'row']), {
        table: self
    });
};

Table.prototype.getRowset = function (callback) {
    var self = this;
    var identifier = this.getIdentifier().clone();
    
    return this.getObject(identifier.setPath(['database', 'rowset']), {
        table: self
    });
};

Table.prototype.getColumns = function () {
    var defer = Q.pending();
    var self = this;

    if(self.columns !== undefined) {
        defer.resolve(self.columns);
    }

    self.isConnected()
        .then(function(connection) {
            connection.query('SHOW COLUMNS FROM ' + self.getName(), function (err, rows) {
                self.columns = rows;
                defer.resolve(rows);
            });
        });
    
    return defer.promise;
};

Table.prototype.getUniqueColumns = function () {
    var defer = Q.pending();
    var self = this;
    var fields = [];

    self.getColumns()
        .then(function(columns) {
            for(index in columns) {
                if(columns[index].Key == 'PRI' || columns[index].Key == 'UNI') {
                    fields.push(columns[index]);
                }
            }

            defer.resolve(fields);
        });
    
    return defer.promise;
};

module.exports = Table;
