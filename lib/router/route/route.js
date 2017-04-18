var formidable = require('formidable'),
    url = require('url');

class Route {
    constructor(path, options) {
        this.path = path;
        this.options = options || {};
        this.compiled = require('./compiler').compile(this);
    }

    match(url) {
        return this.compiled.regex.test(url);
    }

    execute(request) {
        // Do the other stuff.
        var uri = url.parse(request.url, true),
            query = uri.query ? clone(uri.query) : {},
            matches = [],
            variable = '';

        if(this.options['_redirect']) {
            // Redirect the url.
            uri.pathname = this.options._redirect;
        } else {
            matches = this.compiled.regex.exec(uri.pathname);

            for(var i = 1; i < matches.length; i++) {
                variable = this.compiled.variables[i - 1];

                if(variable) {
                    query[variable] = matches[i];
                }
            }
        }


        return this._getPost(request)
            .then(function(data) {
                return {
                    method: request.method,
                    path: uri.pathname,
                    headers: clone(request.headers),
                    data: data[0],
                    files: data[1],
                    query: clone(query)
                };
            })
    }

    _getPost(request) {
        return new Promise(function(resolve, reject) {
            (new formidable.IncomingForm()).parse(request, function(err, fields, files) {
                if(err) {
                    return reject(err);
                }

                return resolve([fields, files]);
            });
        });
    }
}

module.exports = Route;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}