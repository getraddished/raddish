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

    return new Promise(function(resolve, reject) {
        Base.prototype.initialize(config)
            .then(function(table) {
                self.db = config.db;
                self.db_config = self.getConfig('db')[config.db];
                self.name = self.getIdentifier().getComponent() + '_' + Inflector.pluralize(self.getIdentifier().getName());

                resolve(self);
            })
    });
};

Table.prototype.getName = function () {
    return this.name;
};

Table.prototype.select = function (query, mode, callback) {
    var self = this;
    var localData = undefined;

    return new Promise(function(resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                return new Promise(function(resolve, reject) {
                    connection.query(query, function(err, data) {
                        resolve(data);
                    });
                });
            })
            .then(function(data) {
                localData = data;

                if(mode === 1) {
                    return self.getRow();
                } else if(mode === 2) {
                    return self.getRowset();
                }
            })
            .then(function(object) {
                if(mode === 1) {
                    return object.setData(localData[0]);
                } else if(mode === 2) {
                    return object.setData(localData);
                }
            })
            .then(function(object) {
                resolve(object);
            })
            .catch(function(err) {
                console.log(err);
            });
    });
};

/**
 * Like UDP fire and pray ;)
 */
Table.prototype.insert = function (query) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                connection.query(query.toString(), function(err, row) {
                    resolve(row);
                });
            });
    });
};

Table.prototype.update = function (query) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                connection.query(query.toString(), function(err, row) {
                    resolve(row);
                });
            });
    });
};

Table.prototype.delete = function (query) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                connection.query(query.toString(), function(err, row) {
                    resolve(row);
                });
            });
    });
};

Table.prototype.isConnected = function () {
    var self = this;

    return new Promise(function(resolve, reject) {
        Database.getInstance(self.db, self.db_config)
            .then(function (connection) {
                if(!connection) {
                    reject({
                        error: 500,
                        message: 'Unable to connecto to database'
                    });
                } else {
                    resolve(connection);
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    });
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
    var self = this;

    return new Promise(function(resolve, reject) {
        if(self.columns !== undefined) {
            resolve(self.columns);
        }

        self.isConnected()
            .then(function(connection) {
                connection.query('SHOW COLUMNS FROM ' + self.getName(), function (err, rows) {
                    self.columns = rows;
                    resolve(rows);
                });
            })
    });
};

Table.prototype.getUniqueColumns = function () {
    var self = this;
    var fields = [];

    return new Promise(function(resolve, reject) {
        self.getColumns()
            .then(function(columns) {
                for(index in columns) {
                    if(columns[index].Key == 'PRI' || columns[index].Key == 'UNI') {
                        fields.push(columns[index]);
                    }
                }

                resolve(fields);
            });
    });
};

module.exports = Table;
