"use strict";

var Abstract    = require('./abstract'),
    util        = require('util');

/**
 * Basic permissions object
 *
 * @param {Object} config The config object.
 */
function Permission(config) {
    Abstract.call(this, config);
}

util.inherits(Permission, Abstract);

/**
 * Return true by default on a browse request.
 *
 * @method canBrowse
 * @param {CommandContext} context The complete context from the controller
 * @returns {Promise} Containing true by default
 */
Permission.prototype.canBrowse = function() {
    return Promise.resolve(true);
};

/**
 * Return true by default on a browse request.
 *
 * @method canRead
 * @param {CommandContext} context The complete context from the controller
 * @returns {Promise} Containing true by default
 */
Permission.prototype.canRead = function() {
    return Promise.resolve(true);
};

/**
 * Only when a user is authenticated return true else return false.
 *
 * @method canAdd
 * @param {CommandContext} context The complete context from the controller
 * @returns {Promise} Containing true by default
 */
Permission.prototype.canAdd = function(context) {
    var auth = context.getProperty('auth');

    if(auth) {
        if(auth.username && auth.password) {
            return Promise.resolve(true);
        }
    }

    return Promise.resolve(false);
};

/**
 * Only when a user is authenticated return true else return false.
 *
 * @method canEdit
 * @param {CommandContext} context The complete context from the controller
 * @returns {Promise} Containing true by default
 */
Permission.prototype.canEdit = function(context) {
    var auth = context.getProperty('auth');

    if(auth) {
        if(auth.username && auth.password) {
            return Promise.resolve(true);
        }
    }

    return Promise.resolve(false);
};

/**
 * Only when a user is authenticated return true else return false.
 *
 * @method canDelete
 * @param {CommandContext} context The complete context from the controller
 * @returns {Promise} Containing true by default
 */
Permission.prototype.canDelete = function(context) {
    var auth = context.getProperty('auth');

    if(auth) {
        if(auth.username && auth.password) {
            return Promise.resolve(true);
        }
    }

    return Promise.resolve(false);
};

module.exports = Permission;
