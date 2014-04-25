var AbstractAdapter = require('./abstract');
var util            = require('util');
var squel           = require('squel');
var mysql           = require('mysql');
var instances       = {};

function MysqlAdapter() {
    MysqlAdapter.super_.call(this);

    this.queryBuilder = squel;
}

util.inherits(MysqlAdapter, AbstractAdapter);

MysqlAdapter.prototype.getInstance = function(name, config) {
    return new Promise(function (resolve, reject) {
        if (instances[name]) {
            resolve(instances[name]);
        } else {
            var connection = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port || 3306
            });

            // Save the instance in the cache.
            instances[name] = Promise.promisifyAll(connection);
            resolve(instances[name]);
        }
    });
};

module.exports = MysqlAdapter;