var AbstractAdapter = require('./abstract');
var util            = require('util');
var sqlite          = require('sqlite3');
var query           = require('universal-query');
var instances       = {};
var Filter          = require('../../filter/filter');
var MysqlAdapter    = require('./mysql');

/**
 * The SQLite adapter uses a file stored on the server as its database
 * This adapter will create a connection with that file.
 *
 * @class SqliteAdapter
 * @extends AbstractAdapter
 * @param {Object} config This is the config object for the adapter
 * @param {Object} connection The connection to the server
 * @constructor
 */
function SqliteAdapter(config, connection) {
    AbstractAdapter.call(this, config);

    if(connection) {
        this.connection = Promise.promisifyAll(connection);
    }

    this.queryBuilder = query.getType('mysql');
}

util.inherits(SqliteAdapter, AbstractAdapter);

SqliteAdapter.prototype.types = MysqlAdapter.prototype.types

/**
 * This method will return an instance of the sqlite database,
 * If there is a problem with the connection an error will be thrown.
 *
 * @method getInstance
 * @param name
 * @param config
 * @returns {Object} A resolved promise with the connection.
 */
SqliteAdapter.prototype.getInstance = function(name, config) {
    var self = this;

    if(instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        return new Promise(function(resolve, reject) {
            resolve(new sqlite.Database(config.host + '/' + config.database));
        }).then(function(connection) {

            instances[name] = new SqliteAdapter({
                identifier: self.getIdentifier()
            }, connection);

            return instances[name];
        }).catch(function(error) {
            throw new RaddishError(500, error.message);
        });
    }
};

/**
 * This method will create the schema to use.
 *
 * @method getSchema
 * @param {String} name The name of the table to get the schema from.
 * @returns {Promise} The promise containing the schema.
 */
SqliteAdapter.prototype.getSchema = function(name) {
    var result  = {};
    var self    = this;

    return this.connection.allAsync('PRAGMA table_info(' + name + ')')
        .each(function(column) {
            result[column.name] = {
                name: column.name,
                unique: column.pk,
                autoinc: column.pk,
                value: column.dflt_value,
                type: self.getType(column.type),
                filter: Filter.getFilter(self.getType(column.type))
            };
        })
        .then(function(columns) {
            // We only serve the columns on this one.
            return {columns: result};
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });
};

/**
 * This method will execute a query on the server.
 *
 * @method execute
 * @param {Object} query The query object to execute.
 * @returns {Promise} The promise with all the data returned from the server.
 */
SqliteAdapter.prototype.execute = function(query) {
    return this.connection.allAsync(query.toQuery())
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });
};

SqliteAdapter.prototype.getType = MysqlAdapter.prototype.getType;

module.exports = SqliteAdapter;