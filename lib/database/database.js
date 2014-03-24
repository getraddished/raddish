var mysql       = require('mysql');
var instances   = [];

function Database() {
    
};

Database.prototype.getInstance = function (name, config) {
    return new Promise(function(resolve, reject) {
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
            instances[name] = connection;
            resolve(instances[name])
        }
    });
};

module.exports = new Database();