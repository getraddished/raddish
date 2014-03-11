var mysql       = require('mysql');
var instances   = [];

function Database() {
    
};

Database.prototype.getInstance = function (name, config, callback) {
    if (instances[name]) {
        callback(instances[name]);
    } else {
        callback(mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 3306
        }));
    }
};

module.exports = new Database();