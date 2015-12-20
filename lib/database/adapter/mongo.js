"use strict";

var AbstractAdapter = require('./abstract'),
    util            = require('util'),
    query           = require('universal-query'),
    mongo           = require('mongodb').MongoClient,
    Filter          = require('../../filter/filter'),
    instances       = {};

/**
 * The MongoDB database adapter.
 * This adapter will create a connection with the MongoDB server
 *
 * @class MongoAdapter
 * @extends AbstractAdapter
 * @param {Object} config This is the config object for the adapter
 * @param {Object} connection The connection to the server
 * @constructor
 */
function MongoAdapter(config, connection) {
    AbstractAdapter.call(this, config);

    this.connection = connection;
    this.strictColumns = false;

    this.types = {

    };

    this.queryBuilder = query('mongo');
}

util.inherits(MongoAdapter, AbstractAdapter);

/**
 * This method will return a single instance of a server connection.
 * If the connection does not exists it will try to create it.
 *
 * @method getInstance
 * @param {String} name The instance name
 * @param {Object} config The config object for the connection.
 * @returns {Promise} The server connection to use.
 */
MongoAdapter.prototype.getInstance = function(name, config) {
    var auth = '';
    var self = this;

    if(instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        // We will create our auth string.
        if(config.user && config.password) {
            auth = config.user + ':' + config.password + '@';
        }

        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://' + auth + config.host + ':' + (config.port || 27017) + '/' + config.database, function(err, connection) {
                if(err) {
                    return reject(err);
                }
                
                return resolve(connection);
            });
        }).then(function(connection) {
            instances[name] = new MongoAdapter({
                identifier: self.getIdentifier()
            }, connection);

            return instances[name];
        });

    }
};

/**
 * This is an intermediary method that will check your query and send it through to the correct method.
 *
 * @method execute
 * @param {Object} query The query to be executed
 * @returns {Promise} The promise with the received data
 */
MongoAdapter.prototype.execute = function(query) {
    var method = '';

    switch(query.constructor.name) {
        case 'SelectQuery':
            method = 'Select';
            break;
        case 'InsertQuory':
            method = 'Insert';
            break;
        case 'UpdateQuery':
            method = 'Update';
            break;
        case 'DeleteQuery':
            method = 'Delete';
            break;
    }

    var collection = this.connection.collection(query.getTable());

    return this['_execute' + method](collection, query);
};

/**
 * This method will hold all the logic for the select query.
 *
 * @method _executeSelect
 * @params {Collection} collection The MongoDB Collection
 * @param {SelectQuery} query The query to execute.
 * @private
 */
MongoAdapter.prototype._executeSelect = function(collection, query) {
    return new Promise(function(resolve, reject) {
        collection.find(query.toQuery, function(err, result) {
            if(query.getLimit() > 0) {
                result.limit(query.getLimit());

                if(query.getOffset()) {
                    result.skip(query.getOffset());
                }
            }

            result.toArray(function(err, result) {
                if(err) {
                    return reject(err);
                }

                return resolve(result);
            });
        });
    });
};
/**
 * This method will insert one single item into the database.
 *
 * @method _executeInsert
 * @param {Collection} collection The MongoDB Collection.
 * @param {InsertQuery} query The query to execute.
 * @returns {Promise} A promise containing the inserted row.
 * @private
 */
MongoAdapter.prototype._executeInsert = function(collection, query) {
    return new Promise(function(resolve, reject) {
        collection.insertOne(query.toQuery, function(err, result) {

        });
    });
};

/**
 * This method will update an existing object.
 *
 * @method _executeUpdate
 * @param {Collection} collection The MongoDB Collection.
 * @param {UpdateQuery} query The query to execute.
 * @returns {Promise} A promise containing the updated row.
 * @private
 */
MongoAdapter.prototype._executeUpdate = function(collection, query) {
    return new Promise(function(resolve, reject) {
        var query = query.toQuery();
        var $set = query.$set;

        delete query.$set;

        collection.updateOne(query, $set, function(err, result) {
            if(err) {
                return reject(err);
            }

            collection.find(query, function(err, result) {
                if(err) {
                    return reject(err);
                }

                result.toArray(function(err, result) {
                    if(err) {
                        return reject(err);
                    }

                    return resolve(result);
                });
            })
        });
    });
};

/**
 * This method will delete an existing row.
 *
 * @method _executeDelete
 * @param {Collection} collection The MongoDB Collection.
 * @param {DeleteQuery} query The query to execute.
 * @returns {Promise} A promise containing the deleted row.
 * @private
 */
MongoAdapter.prototype._executeDelete = function(collection, query) {
    return new Promise(function(resolve, reject) {
        collection.deleteOne(query.toQuery, function(err, result) {
            if(err) {
                return reject(err);
            }

            result.toArray(function(err, result) {
                if(err) {
                    return reject(err);
                }

                return resolve(result);
            });
        });
    });
};

/**
 * This method will create the schema to use.
 *
 * @method getSchema
 * @param {String} name The name of the table to get the schema from.
 * @returns {Promise} The promise containing the schema.
 */
MongoAdapter.prototype.getSchema = function(name) {
    var result = {};
    var self = this;

    return this._fetchInfo(name)
        .then(function(info) {
            result.info = info;

            return self._fetchIndexes(name);
        })
        .then(function(indexes) {
            result.indexes = indexes;

            return self._fetchColumns(name);
        })
        .then(function(columns) {
            result.columns = columns;

            return result;
        });
};

/**
 * This method will receive various information of the server.
 *
 * @method _fetchInfo
 * @param {String} name The table name from which to return the data.
 * @returns {Promise} The promise with the server information.
 * @private
 */
MongoAdapter.prototype._fetchInfo = function(name) {
    return Promise.resolve({
        name: name
    });
};

/**
 * This function will return the indexes on the selected table.
 *
 * @method _fetchIndexes
 * @param {String} name The table name to get the indexed from
 * @returns {Promse} The promise with all the information.
 * @private
 */
MongoAdapter.prototype._fetchIndexes = function(name) {
    var collection = this.connection.collection(name);

    return new Promise(function(resolve, reject) {
        collection.indexes(function(err, indexes) {
            if(err) {
                return reject(err);
            }

            if(indexes.length <= 0) {
                return resolve([
                    '_id'
                ]);
            } else {
                return resolve(indexes);
            }
        });
    });
};

/**
 * This method will return the column layout.
 * This column layout will be used in the data responses.
 *
 * @param {String} name The name of the table to get the columns from.
 * @returns {Promise} The promise with the table columns.
 * @private
 */
MongoAdapter.prototype._fetchColumns = function(name) {
    var collection  = this.connection.collection(name);

    return new Promise(function(resolve, reject) {
        collection.find(function(err, rows) {
            if(err) {
                return reject(err);
            }
            
            return resolve(rows);
        })
    }).then(function(rows) {
        return new Promise(function(resolve, reject) {
            rows.toArray(function(err, result) {
                if(err) {
                    return reject(err);
                }
                
                return resolve(result);
            });
        });
    }).then(function(rows) {
        var columns = {};

        // Always add _id
        columns['_id'] = {
            name: '_id',
            unique: true,
            autoinc: true,
            value: null,
            type: 'mongo-id',
            filter: Filter.getFilter('mongo-id')
        };

        for(var index in rows) {
            var row = rows[index];

            for(var key in row) {
                var type = getType(row[key]);
                if(!columns[key]) {
                    columns[key] = {
                        name: key,
                        unique: false,
                        autoinc: false,
                        value: null,
                        type: type,
                        filter: Filter.getFilter(type)
                    };
                }
            }
        }

        return columns;
    });
};

/**
 * This function will define the type of the column data.
 *
 * @param {Object} item the item to get the type from.
 * @returns {String} The object type.
 */
function getType(item) {
    if (Object.prototype.toString.call(item) === "[object Number]") {
        return "number";

    } else if (Object.prototype.toString.call(item) === "[object String]") {
        return "string";

    } else if (Object.prototype.toString.call(item) === "[object Date]") {
        return "date";

    } else if(Object.prototype.toString.call(item) === '[object Array]' ) {
        return "array";

    } else if(Object.prototype.toString.call(item) === '[object Null]') {
        return "string";

    } else if(typeof(item) === "object") {
        for(var index in item) {
            return index[index];
        }

    } else{
        return (typeof item)[0].toUpperCase() + (typeof item).slice(1);

    }
}

module.exports = MongoAdapter;