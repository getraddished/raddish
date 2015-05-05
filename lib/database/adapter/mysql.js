"use strict";

var AbstractAdapter = require('./abstract'),
    util            = require('util'),
    query           = require('universal-query'),
    mysql           = require('mysql'),
    instances       = {},
    Filter          = require('../../filter/filter');

/**
 * The MysqlAdapter is the default adapter in this framework,
 * this sets the queryBuilder object with the "universal-query" module which is a query builder for mysql.
 *
 * @class MysqlAdapter
 * @extends AbstractAdapter
 * @constructor
 */
function MysqlAdapter(config, connection) {
    MysqlAdapter.super_.call(this, config);
    this.connection = connection;

    this.queryBuilder = query.getType('mysql');
}

util.inherits(MysqlAdapter, AbstractAdapter);

MysqlAdapter.prototype.types = {
    // Numeric
    'int'               : 'int',
    'integer'           : 'int',
    'bigint'            : 'int',
    'mediumint'			: 'int',
    'smallint'			: 'int',
    'tinyint'			: 'int',
    'numeric'			: 'int',
    'dec'               : 'int',
    'decimal'           : 'int',
    'float'				: 'int',
    'double'            : 'int',
    'real' 				: 'int',

    // boolean
    'bool'				: 'boolean',
    'boolean' 			: 'boolean',

    // date & time
    'date'              : 'date',
    'time'              : 'time',
    'datetime'          : 'int',
    'timestamp'         : 'int',
    'year'				: 'int',

    // string
    'national char'     : 'string',
    'nchar'             : 'string',
    'char'              : 'string',
    'binary'            : 'string',
    'national varchar'  : 'string',
    'nvarchar'          : 'string',
    'varchar'           : 'string',
    'varbinary'         : 'string',
    'text'				: 'string',
    'mediumtext'		: 'string',
    'tinytext'			: 'string',
    'longtext'			: 'string',

    // blob
    'blob'				: 'raw',
    'tinyblob'			: 'raw',
    'mediumblob'		: 'raw',
    'longblob'          : 'raw',

    //other
    'set'				: 'string',
    'enum'				: 'string',
};

/**
 * This method will return an instance of the mysql connection,
 * If there is a problem with the connection an error will be thrown.
 *
 * @method getInstance
 * @param name
 * @param config
 * @returns {Promise} A resolved promise with the connection.
 */
MysqlAdapter.prototype.getInstance = function(name, config) {
    var self = this;

    if (instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        var options = {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 3306
        };

        var connection = mysql.createConnection(options);
        
        return new Promise(function(resolve, reject) {
            connection.connect(function(err) {
                if(err) {
                    return reject(err);
                }
                
                return resolve(connection);
            })
        }).then(function(connection) {
            instances[name] = new MysqlAdapter({
                identifier: self.getIdentifier()
            }, connection);

            return instances[name];
        }).catch(function(error) {
            throw new RaddishError(500, error.message);
        });
    }
};

/**
 * This method will execute a query on the server.
 *
 * @method execute
 * @param {Object} query The query object to execute.
 * @returns {Promise} The promise with all the data returned from the server.
 */
MysqlAdapter.prototype.execute = function(query) {
    var self = this;
    
    return new Promise(function(resolve, reject) {
        self.connection.query(query.toQuery(), function(err, rows) {
            if(err) {
                return reject(err);
            }
            
            return resolve(rows);
        });
    }).catch(function(error) {
        throw new RaddishError(500, error.message);
    });
};

/**
 * This method will create the schema to use.
 *
 * @method getSchema
 * @param {String} name The name of the table to get the schema from.
 * @returns {Promise} The promise containing the schema.
 */
MysqlAdapter.prototype.getSchema = function(name) {
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
MysqlAdapter.prototype._fetchInfo = function(name) {
    var self = this;
    var table = '\'' + name + '\'';
    
    return new Promise(function(resolve, reject) {
        self.connection.query('SHOW TABLE STATUS LIKE ' + table, function(err, rows) {
            if(err) {
                return reject(err);
            }
            
            return resolve(rows);
        });
    }).then(function(result) {
        result = result[0];

        return {
            name: result.Name,
            engine: result.Engine,
            type: result.Comment == 'VIEW' ? 'VIEW' : 'BASE',
            length: result.Data_length,
            autoinc: result.Auto_increment,
            collation: result.collation,
            description: result.Comment != 'VIEW' ? result.Comment : ''
        };
    }).catch(function(error) {
        throw new RaddishError(500, 'Table: ' + table + ' does not exist');
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
MysqlAdapter.prototype._fetchIndexes = function(name) {
    var self = this;
    
    return new Promise(function(resolve, reject) {
        self.connection.query('SHOW INDEX FROM `' + name + '`', function(err, rows) {
            if(err) {
                return reject(err);
            }
            
            return resolve(rows);
        });
    }).then(function(indexes) {
        var result = {};

        for(var index in indexes) {
            var indx = indexes[index];
            
            if(!result[indx.Key_name]) {
                result[indx.Key_name] = {};
            }
            
            result[indx.Key_name][indx.Seq_in_index] = indx;
        }

        return result;
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
MysqlAdapter.prototype._fetchColumns = function(name) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.connection.query('SHOW FULL COLUMNS FROM ' + name, function(err, rows) {
            if(err) {
                return reject(err);
            }
            
            return resolve(rows);
        });
    }).then(function(rows) {
        var result = {};
            
        for(var index in rows) {
            var filter = rows[index].Comment ? Filter.getFilter(rows[index].Comment.match(/@Filter\("(.*)"\)/)[1]) : undefined;

            result[rows[index].Field] = {
                name: rows[index].Field,
                unique: (rows[index].Key == 'PRI' || rows[index].Key == 'UNI') ? 1 : 0,
                autoinc: (rows[index].Extra.indexOf('auto_increment') != -1) ? 1 : 0,
                value: rows[index].Default,
                type: self.getType(rows[index].Type),
                filter: filter || Filter.getFilter(self.getType(rows[index].Type))
            };
        }

        return result;
    });
};

/**
 * This function will define the type of the column data.
 *
 * @param {Object} item the item to get the type from.
 * @returns {String} The object type.
 * @private
 */
MysqlAdapter.prototype.getType = function(type) {
    type = type.toLowerCase();

    if(type.indexOf('(') > -1) {
        type = type.split('(')[0];
    }

    return this.types[type];
};

module.exports = MysqlAdapter;