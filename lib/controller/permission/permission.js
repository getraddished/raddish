"use strict";

var Abstract    = require('./abstract');
var util        = require('util');

function Permission(config) {
    Permission.super_.call(this, config);
}

util.inherits(Permission, Abstract);

Permission.prototype.canBrowse = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

Permission.prototype.canRead = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

Permission.prototype.canAdd = function(context) {
    return new Promise(function(resolve, reject) {
        if(context.auth) {
            if(context.auth.username && context.auth.password) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
};

Permission.prototype.canEdit = function(context) {
    return new Promise(function(resolve, reject) {
        if(context.auth) {
            if(context.auth.username && context.auth.password) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
};

Permission.prototype.canDelete = function(context) {
    return new Promise(function(resolve, reject) {
        if(context.auth) {
            if(context.auth.username && context.auth.password) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
};

module.exports = Permission;