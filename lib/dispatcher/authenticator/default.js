"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util');

/**
 * This authenticator will do a basic auth check on the headers.
 *
 * @class DefaultAuthenticator
 * @extends ObjectManager
 * @constructor
 */
function DefaultAuthenticator(config) {
    ObjectManager.call(this, config);
}

util.inherits(DefaultAuthenticator, ObjectManager);

/**
 * This authenticator will check for a basic auth header
 * and when it is available it will authenticate the user.
 *
 * This behavior can be overwritten with your own authenticator.
 *
 * @method authenticate
 * @param {Object} request The NodeJS request object.
 * @returns {Promise} The promise containing the username and password
 */
DefaultAuthenticator.prototype.authenticate = function(request) {
    var header = request.headers.authorization || '';
    var token = header.split(/\s+/).pop() || '';
    var auth = new Buffer(token, 'base64').toString();
    var parts = auth.split(/:/);
    var username = parts[0];
    var password = parts[1];

    if(username && password) {
        return Promise.resolve({
            username: username,
            password: password
        });
    } else {
        return Promise.resolve({});
    }
};

module.exports = DefaultAuthenticator;