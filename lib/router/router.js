"use strict";

var fs          = require('fs'),
    zlib        = require('zlib'),
    url         = require('url'),
    mime        = require('mime'),
    Application = require('../application/application');

/**
 * Router object, this will route the request to the application.
 *
 * @class Router
 * @constructor
 */
function Router () {
    this._buildRules = [];
}

/**
 * This method will check if the request is a file, if so it will return the file,
 * if not it will try to find an application and will try to run the component.
 *
 * When a file is found and the gzip option in the config is true it will send a gzipped response.
 *
 * @method route
 * @param {Object} req NodeJS request object
 * @param {Object} res NodeJS response object
 */
Router.prototype.route = function(req, res) {
    if (req.url === '/') {
        req.url = '/index.html';
    }

    Promise.resolve(this.checkFile(req, res))
        .then(this.getRoute.bind(this, req))
        .then(this.checkCors.bind(this, res))
        .then(this.request.bind(this, req, res));
};

/**
 * This method will try to match a route to the current request.
 *
 * @method getRoute
 * @param req
 * @returns {*[]}
 */
Router.prototype.getRoute = function(req) {
    var routes = Raddish.getConfig('router.routes'),
        uri = url.parse(req.url, true);

    /**
     * Steps to desired output.
     * If we find out that the url is a file, we ignore the rest.
     * else we will parse the url.
     *
     * We will loop through all the registred routes, if we find a match we will return this url.
     *
     * Desired output:
     * object containing at least: application, component and view.
     * The rest is used as state.
     */

    // This method is way to big.
    // This must become better.
    for (var index in routes) {
        var route = index.split('/'),
            parts = uri.path.split('/');

        if (req.url == index) {
            req.url = routes[index];
        } else if (route[route.length - 1] === '*') {
            route.pop();

            if (uri.path.indexOf(route.join('/')) === 0) {
                uri.pathname = uri.pathname.replace(route.join('/'), routes[index]).replace('//', '/');

                req.url = url.format(uri);
            }
        } else if (parts.length == route.length) {
            var isFalse = false;

            for(var idx in route) {
                if(route[idx].charAt(0) != ':' && route[idx] != parts[idx]) {
                    isFalse = true;
                } else if(route[idx].charAt(0) === ':') {
                    uri.query[route[idx].substring(1)] = parts[idx];
                }
            }

            if(isFalse) {
                continue;
            }

            uri.pathname = routes[index];
        }
    }

    parts = uri.pathname.split('/');

    if(parts.length == 4) {
        uri.query['view'] = parts.pop();
    }

    uri.query['component'] = parts.pop();
    uri.query['application'] = parts.pop();

    for(index in this._buildRules) {
        if(this._buildRules.hasOwnProperty(index)) {
            this._buildRules[index].call(this, uri);
        }
    }

    req.url = uri;

    return req;
};

/**
 * This method will set the CORS headers to the response.
 *
 * @method checkCors
 * @param {Object} res Nodejs Response Object
 * @returns {*[]}
 */
Router.prototype.checkCors = function(res) {
    var cors = Raddish.getConfig('router.cors');

    if(cors) {
        if(cors.origin && cors.origin.join) {
            cors.origin = cors.origin.join(',');
        }

        if(cors.methods && cors.methods.join) {
            cors.methods = cors.methods.join(',');
        }

        if(cors.credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        if(cors.headers && cors.headers.join) {
            cors.headers = cors.headers.join(',');
        }

        res.setHeader('Access-Control-Allow-Origin', cors.origin);
        res.setHeader('Access-Control-Allow-Methods', cors.methods);
        res.setHeader('Access-Control-Allow-Headers', cors.headers);
    }

    return res;
};

/**
 * This method will check if the request is going to a direct file, if so return it.
 * If gzip is enabled and supported it will gzip the response.
 *
 * @method checkFile
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 * @returns {Promise}
 */
Router.prototype.checkFile = function(req, res) {
    return new Promise(function(resolve, reject) {
        var path = process.cwd() + Raddish.getConfig('public') + req.url,
            stream = fs.createReadStream(path),
            gzip = new zlib.createGzip();

        stream.on('error', function(error) {
            return resolve(true);
        });
        stream.on('end', function() {
            return reject(false);
        });

        if(Router._checkGZip(req) && Raddish.getConfig('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            stream = stream.pipe(gzip);
        }

        stream.pipe(res);
    });
};

/**
 * This method will do the request to the framework to receive the data.
 *
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 */
Router.prototype.request = function(req, res) {
    try {
        var app = Application.matchApplication(req.url.query.application);
        app.runComponent(req.url.query.component, req, res);
    } catch(error) {
        if(error instanceof RaddishError) {
            res.statusCode = error.code;
            res.end(JSON.stringify({
                'code': error.code,
                'message': error.message,
                'stack': error.stack
            }));
        }
    }
};

/**
 * This method will check if the gzip value is in the request accept-encoding header,
 * if so return true else return false.
 *
 * @private
 * @param {Object} req NodeJS request object.
 * @returns {Boolean}
 */
Router._checkGZip = function (req) {
    if(req.headers['accept-encoding']) {
        return (req.headers['accept-encoding'].search('gzip') !== false ? true : false)
    } else {
        return false;
    }
};

module.exports = Router;
