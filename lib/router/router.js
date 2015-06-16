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
    var self = this;

    Promise.cast([req, res])
        .spread(this.getRoute)
        .spread(this.checkCors)
        .spread(this.checkFile)
        .spread(this.parseRequest)
        .spread(this.request);
};

/**
 * This method will try to match a route to the current request.
 *
 * @method getRoute
 * @param req
 * @param res
 * @returns {*[]}
 */
Router.prototype.getRoute = function(req, res) {
    var routes = Raddish.getConfig('router.routes');

    if (req.url === '/') {
        req.url = '/index.html';
    }

    for (var index in routes) {
        var route = index.split('/'),
            uri = url.parse(req.url, true),
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
            req.url = url.format(uri);
        }
    }

    return [req, res];
};

/**
 * This method will set the CORS headers to the response.
 *
 * @method checkCors
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 * @returns {*[]}
 */
Router.prototype.checkCors = function(req, res) {
    var cors = Raddish.getConfig('router.cors');

    if(cors) {
        if(cors.origin.join) {
            cors.origin = cors.origin.join(',');
        }

        if(cors.methods.join) {
            cors.methods = cors.methods.join(',');
        }

        if(cors.credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        if(cors.headers.join) {
            cors.headers = cors.headers.join(',');
        }

        res.setHeader('Access-Control-Allow-Origin', cors.origin);
        res.setHeader('Access-Control-Allow-Methods', cors.methods);
        res.setHeader('Access-Control-Allow-Headers', cors.headers);
    }

    return [req, res];
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
    return new Promise(function(resolve) {
        fs.readFile(process.cwd() + Raddish.getConfig('public') + req.url, function(err, data) {
            if(err) {
                resolve([req, res]);
            } else {
                res.setHeader('Content-Type', mime.lookup(process.cwd() + Raddish.getConfig('public') + req.url));

                if(Router._checkGZip(req) && Raddish.getConfig('gzip')) {
                    res.setHeader('Content-Encoding', 'gzip');

                    zlib.gzip(data, function(err, data) {
                        res.end(data);
                    });
                } else {
                    res.end(data);
                }
            }
        });
    });
};

/**
 * This method will try to parse the request if the request a an API request.
 * By default the app and component parameters must be passed in the request.
 *
 * @method parseRequest
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 * @returns {Object} The parsed request object.
 */
Router.prototype.parseRequest = function (req, res) {
    req.url = url.parse(req.url, true);
    var pathparts = req.url.pathname.split('/');
    pathparts.shift();

    if (pathparts[0]) {
        req.url.query['app'] = pathparts[0];
    }

    if (pathparts[1]) {
        req.url.query['component'] = pathparts[1];
    }

    if (pathparts[2]) {
        req.url.query['view'] = pathparts[2];
    }

    return [req, res];
};

/**
 * This method will do the request to the framework to receive the data.
 *
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 */
Router.prototype.request = function(req, res) {
    try {
        var app = Application.matchApplication(req.url);
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