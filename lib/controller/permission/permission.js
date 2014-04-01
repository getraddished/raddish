var Base = require('../../base/base');
var util = require('util');

function Permission() {

}

util.inherits(Permission, Base);

Permission.prototype.canGet = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

Permission.prototype.canPost = function(context) {
    return new Promise(function(resolve, reject) {
        if(context.auth.username && context.auth.password) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

Permission.prototype.canDelete = function(context) {
    return new Promise(function(resolve, reject) {
        if(context.auth.username && context.auth.password) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

module.exports = Permission;