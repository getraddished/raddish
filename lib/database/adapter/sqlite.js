var AbstractAdapter = require('./abstract'),
    util            = require('util'),
    sqlite          = require('sqlite3'),
    query           = require('universal-query'),
    instances       = {},
    Filter          = require('../../filter/filter'),
    MysqlAdapter    = require('./mysql');

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
        this.connection = connection;
    }

    this.queryBuilder = query('mysql');
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

    return new Promise(function(resolve, reject) {
        this.connection.all('PRAGMA table_info(' + name + ')', function(err, columns) {
            if(err) {
                return reject(err);
            }
            
            return resolve(columns);
        })
    }).each(function(column) {
        result[column.name] = {
            name: column.name,
            unique: column.pk,
            autoinc: column.pk,
            value: column.dflt_value,
            type: self.getType(column.type),
            filter: Filter.getFilter(self.getType(column.type))
        };
    }).then(function() {
        // We only serve the columns on this one.
        return {columns: result};
    }).catch(function(error) {
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
    var self = this;

    if(query.constructor.name == 'InsertQuery') {
        return new Promise(function(resolve) {
            self.connection.run(query.toQuery(), function(err) {
                if(err) {
                    throw new RaddishError(500, error.message);
                }
                
                resolve({insertId: this.lastID});
            });
        });
    }
    
    return new Promise(function(resolve, reject) {
        this.connection.all(query.toQuery(), function(err, data) {
            if(err) {
                return reject(err);
            }
            
            return resolve(data);
        });
    }).catch(function(error) {
        throw new RaddishError(500, error.message);
    });
};

SqliteAdapter.prototype.getType = MysqlAdapter.prototype.getType;

module.exports = SqliteAdapter;