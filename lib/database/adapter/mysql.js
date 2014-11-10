"use strict";

var AbstractAdapter = require('./abstract');
var util            = require('util');
var query           = require('universal-query');
var mysql           = require('mysql');
var instances       = {};
var Filter          = require('../../filter/filter');
var fs              = require('fs');

/**
 * The MysqlAdapter is the default adapter in this framework,
 * this sets the queryBuilder object with the "squel" module which is a query builder for mysql.
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
 * This function will return an instance of the mysql connection,
 * If there is a problem with the connection an error will be thrown.
 *
 * @method getInstance
 * @param name
 * @param config
 * @returns {Object} A resolved promise with the connection.
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

//        if(config.options && config.options.ssl) {
//            if(config.options.ssl.key && config.options.ssl.cert) {
//                options['ssl'] = {
//                    key: fs.readFileSync(config.options.ssl.key),
//                    cert: fs.readFileSync(config.options.ssl.cert)
//                }
//            } else {
//                throw new RaddishError(500, 'SSL Key and Certificate not present.');
//            }
//        }

        var connection = mysql.createConnection(options);

        // Save the instance in the cache.
        var conn = Promise.promisifyAll(connection);

        return conn.connectAsync()
            .then(function(connection) {
                instances[name] = new MysqlAdapter({
                    identifier: self.getIdentifier()
                }, conn);

                return instances[name];
            })
            .catch(function(error) {
                throw new RaddishError(500, error.message);
            });
    }
};

MysqlAdapter.prototype.execute = function(query) {
    return this.connection.queryAsync(query.toQuery())
        .then(function(data) {
            return data[0];
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });
};

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

MysqlAdapter.prototype._fetchInfo = function(name) {
    var self = this;
    var table = '\'' + name + '\'';

    return this.connection.queryAsync('SHOW TABLE STATUS LIKE ' + table)
        .then(function(result) {
            result = result[0][0];

            return {
                name: result.Name,
                engine: result.Engine,
                type: result.Comment == 'VIEW' ? 'VIEW' : 'BASE',
                length: result.Data_length,
                autoinc: result.Auto_increment,
                collation: result.collation,
                description: result.Comment != 'VIEW' ? result.Comment : ''
            };
        })
        .catch(function(error) {
            throw new RaddishError(500, 'Table: ' + table + ' does not exist');
        });
};

MysqlAdapter.prototype._fetchIndexes = function(name) {
    return this.connection.queryAsync('SHOW INDEX FROM `' + name + '`')
        .then(function(result) {
            var result = {};
            var indexes = result[0];

            for(var index in indexes) {
                var indx = indexes[index];

                result[indx.Key_name][indx.Seq_in_index] = indx;
            }

            return result;
        });
};

MysqlAdapter.prototype._fetchColumns = function(name) {
    var self = this;

    return this.connection.queryAsync('SHOW FULL COLUMNS FROM ' + name)
        .then(function(rows) {
            var result = {};

            for(var index in rows[0]) {
                var filter = rows[0][index].Comment ? Filter.getFilter(rows[0][index].Comment.match(/@Filter\("(.*)"\)/)[1]) : undefined;

                result[rows[0][index].Field] = {
                    name: rows[0][index].Field,
                    unique: (rows[0][index].Key == 'PRI' || rows[0][index].Key == 'UNI') ? 1 : 0,
                    autoinc: (rows[0][index].Extra.indexOf('auto_increment') != -1) ? 1 : 0,
                    value: rows[0][index].Default,
                    type: self.getType(rows[0][index].Type),
                    filter: filter || Filter.getFilter(self.getType(rows[0][index].Type))
                };
            }

            return result;
        });
};

MysqlAdapter.prototype.getType = function(type) {
    type = type.toLowerCase();

    if(type.indexOf('(') > -1) {
        type = type.split('(')[0];
    }

    return this.types[type];
};

module.exports = MysqlAdapter;