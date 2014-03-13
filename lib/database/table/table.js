var Object      = require('../../base/base');
var Database    = require('../database');
var Inflector   = require('../../inflector/inflector');
var util        = require('util');

function Table() {
    this.columns = undefined;
}

util.inherits(Table, Object);

Table.prototype.initialize = function (config, callback) {
    var self = this;
    
    Table.super_.prototype.initialize.call(this, config, function (done) {
        self.db = config.db;
        self.db_config = self.getConfig('db')[config.db];
        self.name = self.getIdentifier().getComponent() + '_' + Inflector.pluralize(self.getIdentifier().getName());
        
        callback(null);
    });
};

Table.prototype.getName = function () {
    return this.name;
};

Table.prototype.select = function (query, mode, callback) {
    var self = this;
    
    this.isConnected(function (err, connection) {
        if(err) {
            callback(err, null);
        } else {
            connection.query(query, function (err, data) {
                if(mode === 1) {
                    self.getRow(function(row) {
                        row.setData(data[0], function(row) {
                            row.new = false;

                            return callback(null, row);
                        });
                    });
                } else if(mode === 2) {
                    self.getRowset(function(rowset) {
                        rowset.setData(data, function(rowset) {
                            return callback(null, rowset);
                        });
                    });
                }
            });
        }
    });
};

/**
 * Like UDP fire and pray ;)
 */
Table.prototype.insert = function (query, callback) {
    this.isConnected(function(err, connection) {
        connection.query(query.toString(), function(err, row) {
            callback(err, row);
        });
    });
};

Table.prototype.update = function (query, callback) {
    this.isConnected(function(err, connection) {
        connection.query(query.toString(), function(err, row) {
            callback(err, row);
        });
    });
};

Table.prototype.delete = function (query, callback) {
    this.isConnected(function(err, connection) {
        connection.query(query.toString(), function(err, row) {
            callback(err, row);
        });
    });
};

Table.prototype.isConnected = function (callback) {
    Database.getInstance(this.db, this.db_config, function (connection) {
        if(!connection) {
            callback({
                error: 500,
                message: 'Unable to connecto to database'
            }, null);
        } else {
            callback(null, connection);
        }
    });
};

Table.prototype.getRow = function (callback) {
    var self = this;
    var identifier = this.getIdentifier().clone();
    
    this.getObject(identifier.setPath(['database', 'row']), {
        table: self
    }, callback);
};

Table.prototype.getRowset = function (callback) {
    var self = this;
    var identifier = this.getIdentifier().clone();
    
    this.getObject(identifier.setPath(['database', 'rowset']), {
        table: self
    }, callback);
};

Table.prototype.getColumns = function (callback) {
    var self = this;
    if(this.columns !== undefined) {
        return callback(this.columns);
    }
    
    this.isConnected(function (err, connection) {
        if(connection) {
            connection.query('SHOW COLUMNS FROM ' + self.getName(), function (err, rows) {
                self.columns = rows;
                callback(rows);
            });
        };
    });
};

Table.prototype.getUniqueColumns = function (callback) {
    var self = this;
    var fields = [];
    
    this.getColumns(function (columns) {
        for(index in columns) {
            if(columns[index].Key == 'PRI' || columns[index].Key == 'UNI') {
                fields.push(columns[index]);
            }
        }
        
        callback(fields);
    });
};

module.exports = Table;
