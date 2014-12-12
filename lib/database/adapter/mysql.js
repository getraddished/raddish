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

/**
 * This method will execute a query on the server.
 *
 * @method execute
 * @param {Object} query The query object to execute.
 * @returns {Promise} The promise with all the data returned from the server.
 */
MysqlAdapter.prototype.execute = function(query) {
    if(Raddish.getConfig('stream')) {
        return this.connection.query(query.toQuery()).stream({objectMode: false});
    }

    return this.connection.queryAsync(query.toQuery())
        .then(function(data) {
            return data[0];
        })
        .catch(function(error) {
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

/**
 * This function will return the indexes on the selected table.
 *
 * @method _fetchIndexes
 * @param {String} name The table name to get the indexed from
 * @returns {Promse} The promise with all the information.
 * @private
 */
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