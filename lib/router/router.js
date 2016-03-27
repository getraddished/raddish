"use strict";

var fs          = require('fs'),
    zlib        = require('zlib'),
    url         = require('url'),
    mime        = require('mime'),
    Application = require('../application/application'),
    _parseRules = [];

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
    if (req.url === '/') {
        req.url = '/index.html';
    }

    Promise.resolve(this.getRoute(req))
        .then(this.checkFile.bind(this, req, res))
        .then(this.checkCors.bind(this, res))
        .then(this.request.bind(this, req, res))
        .catch(function(err) {
            if(err) {
                if ((err instanceof RaddishError)) {
                    res.statusCode = err.code;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        'code': err.code,
                        'message': err.message,
                        'stack': err.stack
                    }));
                    return;
                } else {
                    console.log(err.message);
                    console.log(err.stack);
                    process.exit(1);
                    return;
                }
            }

            //console.log(err);
        });
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
        uri = url.parse(req.url, true),
        parts = uri.pathname.split('/'),
        promises = [];

    for(var index in routes) {
        if(routes.hasOwnProperty(index)) {
            var route = routes[index],
                routeParts = index.split('/'),
                isFound = true;

            if (req.url == index) {
                uri.pathname = route;
                break;
            } else if (routeParts[routeParts.length - 1] === '*') {
                if (uri.pathname.indexOf(route) === 0) {
                    uri.pathname = uri.pathname.replace(route.join('/'), routes[index]).replace('//', '/');
                    break;
                }
            } else if (parts.length === routeParts.length) {
                for (var idx in routeParts) {
                    if (routeParts.hasOwnProperty(idx)) {
                        var routePart = routeParts[idx];

                        if (routePart.charAt(0) != ':' && routePart != parts[idx]) {
                            isFound = false;
                        } else if (routePart.charAt(0) === ':') {
                            uri.query[routePart.substring(1)] = parts[idx];
                        }
                    }
                }

                if (isFound) {
                    uri.pathname = route;
                    break;
                }
            }
        }
    }

    // Reset the parts
    parts = uri.pathname.split('/');

    if(parts.length == 4) {
        uri.query['view'] = parts.pop();
    }

    uri.query['component'] = parts.pop();
    uri.query['application'] = parts.pop();

    for(index in _parseRules) {
        if(_parseRules.hasOwnProperty(index)) {
            _parseRules[index](this, uri);
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
        var path = process.cwd() + Raddish.getConfig('public') + req.url.pathname,
            gzip = new zlib.createGzip();

        if(fs.existsSync(path)) {
            var stream = fs.createReadStream(path);

            if(Router._checkGZip(req) && Raddish.getConfig('gzip')) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Type', mime.lookup(path));

                stream = stream.pipe(gzip);
            }

            stream.pipe(res);
            return reject(false);
        }

        return resolve(true);
    });
};

/**
 * This method will do the request to the framework to receive the data.
 *
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 */
Router.prototype.request = function(req, res) {
    var app = Application.matchApplication(req.url.query.application);
    app.runComponent(req.url.query.component, req, res);
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

Router.addParseRule = function(rule) {
    if(_parseRules.indexOf(rule) === -1) {
        _parseRules.push(rule);
    }

    return this;
};

module.exports = Router;
