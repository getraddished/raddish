var fs          = require('fs');
var zlib        = require('zlib');
var Base        = require('../base/base');
var url         = require('url');
var mime        = require('mime');
var Inflector   = require('../inflector/inflector');

function Router(req, res) {
    var self = this;

    if(req.url === '/') {
        req.url = '/index.html';
    }

    fs.exists(process.cwd() + '/public' + req.url, function(exists) {
        if(exists) {
            if(self.checkGZip(req)) {
                var gzip = zlib.createGzip();
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Type', mime.lookup(process.cwd() + '/public' + req.url));
                fs.createReadStream(process.cwd() + '/public' + req.url).pipe(gzip).pipe(res);
            } else {
                fs.readFile(process.cwd() + '/public' + req.url, function(data) {
                    res.end(data);
                });
            }
        } else {
            req = self.parseRequest(req);

            self.getDispatcher(req)
                .then(function(dispatcher) {
                    console.log(dispatcher);
                    dispatcher.dispatch(req, res);
                })
                .catch(function(err) {
                    console.log('Dispatcher not found');
                });
        }
    });
};

Router.prototype.parseRequest = function(req) {
    // All we do here is parse the parts into the query.
    req.url = url.parse(req.url, true);
    var pathparts = req.url.pathname.split('/');
    pathparts.shift();

    if(pathparts[0]) {
        req.url.query['app'] = pathparts[0];
    }

    if(pathparts[1]) {
        req.url.query['component'] = pathparts[1];
    }

    req.url.query['view'] = (pathparts[2] || pathparts[1]);

    /**
     * For support for the most used javascript libraries (eg: Angular/ Ember)
     * I will allow singular view names for plural data retreival.
     *
     * This must be enabled in the config, and when activated the listener for the id, is VERY strict.
     */
     var base = new Base();
     if(base.getConfig('allow_singular_plural')) {
        if(req.url.query['id'] == undefined) {
            req.url.query.view = Inflector.pluralize(req.url.query.view);
        }
     }

    return req;
}

Router.prototype.getDispatcher = function(req) {
    var base = new Base();

    return base.getObject(req.url.query.app + ':' + req.url.query.component + '.dispatcher', null);
};

Router.prototype.checkGZip = function(req) {
    return (req.headers['accept-encoding'].search('gzip') !== false ? true : false)
};

module.exports = Router;