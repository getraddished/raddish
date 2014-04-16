var fs          = require('fs');
var zlib        = require('zlib');
var Base        = require('../base/base');
var url         = require('url');
var mime        = require('mime');
var Inflector   = require('../inflector/inflector');
var Application = require('../application/application');

function Router () {

}

Router.prototype.route = function(req, res) {
    var self = this;

    if (req.url === '/') {
        req.url = '/index.html';
    }

    fs.exists(process.cwd() + '/public' + req.url, function (exists) {
        if (exists) {
            if (self.checkGZip(req)) {
                var gzip = zlib.createGzip();

                res.statusCode = 200;
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Type', mime.lookup(process.cwd() + '/public' + req.url));
                fs.createReadStream(process.cwd() + '/public' + req.url).pipe(gzip).pipe(res);
            } else {
                res.statusCode = 200;
                fs.createReadStream(process.cwd() + '/public' + req.url).pipe(res);
            }
        } else {
            req = self.parseRequest(req);

            try {
                var app = Application.matchApplication(req.url);
                app.runComponent(req.url.query.component, req, res);
            } catch(error) {
                if(error instanceof RaddishError) {
                    res.statusCode = error.code;
                    res.end(JSON.stringify(error));
                }
            }
        }
    });
};

Router.prototype.parseRequest = function (req) {
    // All we do here is parse the parts into the query.
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

    return req;
}

Router.prototype.getDispatcher = function (req) {
    var base = new Base();

    return base.getObject(req.url.query.app + ':' + req.url.query.component + '.dispatcher', null);
};

Router.prototype.checkGZip = function (req) {
    if(req.headers['accept-encoding']) {
        return (req.headers['accept-encoding'].search('gzip') !== false ? true : false)
    } else {
        return false;
    }
};

module.exports = Router;