'use strict';

/**
 * The AbstractAuthenticator class is a blueprint for a custom authenticator class.
 * All methods located in here need to be overwritten in your own authenticator.
 *
 * @class AbstractAuthenticator
 */
class AbstractAuthenticator {
    /**
     * The authenticate method will try to authenticate the request.
     * In this class an empty object will be returned.
     *
     * @param {Request} request The nodejs request object.
     * @returns {Object} The authenticated user information.
     */
    authenticate() {
        return {};
    }
}

module.exports = AbstractAuthenticator;