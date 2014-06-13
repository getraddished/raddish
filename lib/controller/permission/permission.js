"use strict";

var Service = require('../../service/service');
var util    = require('util');

function Permission(config) {
    Permission.super_.call(this, config);
}

util.inherits(Permission, Service);

Permission.prototype.canGet = function(context) {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
};

Permission.prototype.canPost = function(context) {
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