var Base        = require('../../base/base');
var Database    = require('../database');
var Inflector   = require('../../inflector/inflector');
var util        = require('util');

/**
 * Default table class
 *
 * @class Table
 * @constructor
 */
function Table() {
    Table.super_.apply(this, arguments);

    this.columns = undefined;
    this.rowObj = undefined;
}

util.inherits(Table, Base);

/**
 * Initialize function to initialize the Table model
 *
 * @method initialze
 * @param {Object|null} config Config object for the Table object
 * @returns {Promise} The initialized Table object
 */
Table.prototype.initialize = function (config) {
    var self = this;

    return new Promise(function (resolve, reject) {
        Table.super_.prototype.initialize.call(self, config)
            .then(function (table) {
                self.db = config.db;
                self.db_config = self.getConfig('db')[config.db];
                self.name = (self.db_config.prefix ? self.db_config.prefix : '') + (config.name || self.getIdentifier().getComponent() + '_' + Inflector.pluralize(self.getIdentifier().getName()));

                self.getSchema()
                    .then(function(schema) {
                        resolve(self);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

/**
 * This function returns the name of the table.
 *
 * @returns {string} Table name
 */
Table.prototype.getName = function () {
    return this.name;
};

/**
 * This function tries to get get a row or rowset from the table.
 *
 * @param {String} query
 * @param {Int} mode Mode to get from the table.
 * @returns {Promise} The data requested from the database.
 */
Table.prototype.select = function (query, mode) {
    var self = this;
    var localData = undefined;

    return new Promise(function (resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                return new Promise(function (resolve, reject) {
                    connection.query(query, function (err, data) {
                        resolve(data);
                    });
                });
            })
            .then(function (data) {
                if (mode === 1) {
                    return [self.getRow(), data];
                } else if (mode === 2) {
                    return [self.getRowset(), data];
                }
            })
            .spread(function (object, data) {
                if (mode === 1) {
                    return object.setData(data[0]);
                } else if (mode === 2) {
                    return object.setData(data);
                }
            })
            .then(function (object) {
                resolve(object);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

/**
 * This function will try to insert a row in the database
 *
 * @method insert
 * @param {String} query The query string for the database
 * @return {Promise} The inserted data
 */
Table.prototype.insert = function (query) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.isConnected()
            .then(function (connection) {
                connection.query(query.toString(), function (err, row) {
                    resolve(row);
                });
            });
    });
};

/**
 * This function will try to update a row in the database
 *
 * @method update
 * @param {String} query The query string for the database
 * @return {Promise} The updated data
 */
Table.prototype.update = function (query) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.isConnected()
            .then(function (connection) {
                connection.query(query.toString(), function (err, row) {
                    resolve(row);
                });
            });
    });
};

/**
 * This function will try to delete a row in the database
 *
 * @method delete
 * @param {String} query The query string for the database
 * @return {Promise} The deleted data
 */
Table.prototype.delete = function (query) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.isConnected()
            .then(function (connection) {
                connection.query(query.toString(), function (err, row) {
                    resolve(row);
                });
            });
    });
};

/**
 * This function will check if the database is connected,
 * if it is it will return the connection
 *
 * @method isConnected
 * @returns {Promise} The connection for the database
 */
Table.prototype.isConnected = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        Database.getInstance(self.db, self.db_config)
            .then(function (connection) {
                if (!connection) {
                    reject({
                        error: 500,
                        message: 'Unable to connecto to database'
                    });
                } else {
                    resolve(connection);
                }
            })
            .catch(function (err) {

            });
    });
};

/**
 * This function will return an empty Row object
 * Here we will also cache the Row object for later use.
 *
 * @method getRow
 * @returns {Promise} Returns a Row object
 */
Table.prototype.getRow = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return new Promise(function(resolve, reject) {
        self.getObject(identifier.setPath(['database', 'row']), {
                table: self
            })
            .then(function(row) {
                resolve(row);
            });
    });
};

/**
 * This function will return an empty Rowset object
 *
 * @method getRowset
 * @returns {Promise} Returns a Rowset object
 */
Table.prototype.getRowset = function (callback) {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'rowset']), {
        table: self
    });
};

/**
 * Returns all the columns of the table
 *
 * @method getColumns
 * @returns {Promise} The columns of the table.
 */
Table.prototype.getColumns = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.isConnected()
            .then(function (connection) {
                connection.query('SHOW COLUMNS FROM ' + self.getName(), function (err, rows) {
                    resolve(rows);
                });
            });
    });
};

/**
 * This function will return the unique columns of the table
 *
 * @method getUniqueColumns
 * @returns {Promise} The unique columns of the table.
 */
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

Table.prototype.getSchema = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.isConnected()
            .then(function(connection) {
                return connection.queryAsync('SHOW TABLE STATUS LIKE \'' + self.name + '\'');
            })
            .then(function(rows) {
                if(rows[0].length <= 0) {
                    throw new RaddishError(500, 'Table: ' + self.name + ' does not exist');
                } else {
                    resolve(rows[0]);
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

module.exports = Table;
