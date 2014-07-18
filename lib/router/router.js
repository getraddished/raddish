"use strict";

var fs          = require('fs');
var zlib        = require('zlib');
var url         = require('url');
var mime        = require('mime');
var Inflector   = require('../inflector/inflector');
var Application = require('../application/application');

/**
 * Router object, this will route the request to the application.
 *
 * @class Router
 * @constructor
 */
function Router () {

}

/**
 * This function will check if the request is a file, if so it will return the file,
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
 * This function will try to match a route to the current request.
 *
 * @method getRoute
 * @param req
 * @param res
 * @returns {*[]}
 */
Router.prototype.getRoute = function(req, res) {
    var routes  = Raddish.getConfig('router.routes');

    if(routes[req.url]) {
        req.url = routes[req.url];
    }

    if (req.url === '/') {
        req.url = '/index.html';
    }

    return [req, res];
};

/**
 * This function will set the CORS headers to the response.
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
 * This function will check if the request is going to a direct file, if so return it.
 * If gzip is enabled and supported it will gzip the response.
 *
 * @method checkFile
 * @param {Object} req Nodejs Request Object
 * @param {Object} res Nodejs Response Object
 * @returns {Promise}
 */
Router.prototype.checkFile = function(req, res) {
    var self = this;

    return new Promise(function(resolve, reject) {
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
 * This function will try to parse the request if the request a an API request.
 * By default the app and component parameters must be passed in the request.
 *
 * @method parseRequest
 * @param {Object} req Nodejs Request Object
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
 * This function will do the request to the framework to receive the data.
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
            res.end(JSON.stringify(error));
        }
    }
};

/**
 * This function will check if the gzip value is in the request accept-encoding header,
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