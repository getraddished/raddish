var mysql       = require('mysql');
var instances   = [];

/**
 * A simple class to return a database connection
 *
 * @class Database
 * @constructor
 */
function Database() {

};

/**
 * This function will return either a new connection or an instantiated connection.
 * The first time a connection is made it is cache for later use.
 * The cache is valid until the program is terminated.
 *
 * @method getInstance
 * @param {String} name The identifier of the connection
 * @param {Object} config The information the connection needs
 * @returns {Promise} An initiated connection
 */
Database.prototype.getInstance = function (name, config) {
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

module.exports = new Database();