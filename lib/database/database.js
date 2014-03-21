var mysql       = require('mysql');
var instances   = [];

function Database() {
    
};

Database.prototype.getInstance = function (name, config) {
    var defer = Q.defer();

    if (instances[name]) {
        defer.resolve(instances[name]);
    } else {
        defer.resolve(mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 3306
        }));
    }

    return defer.promise;
};

module.exports = new Database();