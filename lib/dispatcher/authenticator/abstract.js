class AbstractAuthenticator {
    /**
     * The authenticate method will try to authenticate the request.
     * In this class an empty object will be returned.
     *
     * @param {Request} request The nodejs request object.
     * @returns {Object} The authenticated user information.
     */
    authenticate(request) {
        return {};
    }
}

module.exports = AbstractAuthenticator;