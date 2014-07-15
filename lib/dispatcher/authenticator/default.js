var Abstract    = require('./abstract');
var util        = require('util');

function FallbackAuthenticator() {
    Abstract.call(this);
}

util.inherits(FallbackAuthenticator, Abstract);

FallbackAuthenticator.prototype.authenticate = function(request) {
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

module.exports = FallbackAuthenticator;