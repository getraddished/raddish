var util = require('util');

function AbstractAuthenticator() {

}

AbstractAuthenticator.prototype.autenticate = function(request) {
    throw new RaddishError(500, 'Please don\'t call the abstract authenticator');
};

module.exports = AbstractAuthenticator;