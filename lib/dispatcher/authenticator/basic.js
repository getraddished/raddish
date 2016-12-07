var Abstract = require('./abstract');

class BasicAuthenticator() {
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