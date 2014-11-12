var AbstractAdapter = require('./abstract');
var util            = require('util');
var sqlite          = require('sqlite3');
var query           = require('universal-query');
var instances       = {};
var Filter          = require('../../filter/filter');
var MysqlAdapter    = require('./mysql');

function SqliteAdapter(config, connection) {
    AbstractAdapter.call(this, config);

    if(connection) {
        this.connection = Promise.promisifyAll(connection);
    }

    this.queryBuilder = query.getType('mysql');
}

util.inherits(SqliteAdapter, AbstractAdapter);

SqliteAdapter.prototype.types = MysqlAdapter.prototype.types

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