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

    Promise.resolve([req, res])
        .spread(this.getRoute)
        .spread(this.checkFile)
        .spread(this.parseRequest)
        .spread(this.request);
};

Router.prototype.getRoute = function(req, res) {
    var routes  = Raddish.getConfig('routes');

    if(routes[req.url]) {
        req.url = routes[req.url];
    }

    if (req.url === '/') {
        req.url = '/index.html';
    }

    return [req, res];
};

// I have to create a nonblocking check for a file.
// I have a few options, but I don't want to keep the file reads open for too long.
// My best guess is just to read the file.
Router.prototype.checkFile = function(req, res) {
    return new Promise(function(resolve, reject) {
        fs.readFile(process.cwd() + Raddish.getConfig('publicFolder') + req.url, function(err, data) {
            if(err) {
                resolve([req, res]);
            } else {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Type', mime.lookup(process.cwd() + Raddish.getConfig('publicFolder') + req.url));

                zlib.gzip(data, function(err, data) {
                    res.end(data);
                });
            }
        });
    });
};

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
 * This function will try to parse the request if the request a an API request.
 * By default the app and component parameters must be passed in the request.
 *
 * @method parseRequest
 * @param req
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

    if(pathparts[1] || pathparts[2]) {
        req.url.query['view'] = (pathparts[2] || Inflector.pluralize(pathparts[1]));
    }

    return [req, res];
}

/**
 * This function will check if the gzip value is in the request accept-encoding header,
 * if so return true else return false.
 *
 * @param {Object} req NodeJS request object.
 * @returns {Boolean}
 */
Router.prototype.checkGZip = function (req) {
    if(req.headers['accept-encoding']) {
        return (req.headers['accept-encoding'].search('gzip') !== false ? true : false)
    } else {
        return false;
    }
};

module.exports = Router;