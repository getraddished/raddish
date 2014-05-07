"use strict";

var AbstractAdapter = require('./abstract');
var util            = require('util');
var squel           = require('squel');
var mysql           = require('mysql');
var instances       = {};

/**
 * The MysqlAdapter is the default adapter in this framework,
 * this sets the queryBuilder object with the "squel" module which is a query builder for mysql.
 * @constructor
 */
function MysqlAdapter() {
    MysqlAdapter.super_.call(this);

    this.queryBuilder = squel;
}

util.inherits(MysqlAdapter, AbstractAdapter);

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
    if (instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 3306
        });

        // Save the instance in the cache.
        var conn = Promise.promisifyAll(connection);

        return conn.connectAsync()
            .then(function(connection) {
                instances[name] = conn;

                return instances[name];
            })
            .catch(function(error) {
                throw new RaddishError(500, error.message);
            });
    }
};

module.exports = MysqlAdapter;