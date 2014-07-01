var Service = require('../../service/service');
var util    = require('util');

function AbstractPermission(config) {
    Service.call(this, config);
}

util.inherits(AbstractPermission, Service);

AbstractPermission.prototype.canGet = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

AbstractPermission.prototype.canPost = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

module.exports = AbstractPermission;