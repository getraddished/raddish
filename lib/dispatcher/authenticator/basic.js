'use strict';

var Abstract = require('./abstract');

/**
 * The basicAuthenticator will authenticate a user based on basic authentication.
 * On this authentication is no validation in the database, so when a username and password is passed
 * it succeeds.
 *
 * This class can be extended for your own authenticator.
 *
 * @class BasicAuthenticator
 */
class BasicAuthenticator extends Abstract {
    authenticate(request) {
        var header = request.headers.authorization || '',
            token = header.split(/\s+/).pop() || '',
            auth = new Buffer(token, 'base64').toString(),
            parts = auth.split(/:/);

        if(parts.length == 2) {
            return Promise.resolve({
                username: parts[0],
                password: parts[1]
            });
        } else {
            return Promise.resolve({});
        }
    }
}

module.exports = BasicAuthenticator;