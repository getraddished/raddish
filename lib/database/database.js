var mysql       = require('mysql');
var instances   = [];

function Database() {
    
};

Database.prototype.getInstance = function (name, config) {
    return new Promise(function(resolve, reject) {
        if (instances[name]) {
            resolve(instances[name]);
        } else {
            resolve(mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port || 3306
            }));
        }
    });
};

module.exports = new Database();