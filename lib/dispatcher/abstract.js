var ObjectManager   = require('../object/manager');
var util            = require('util');
var Inflector       = require('../inflector/inflector');
var zlib            = Promise.promisifyAll(require('zlib'));

function AbstractDispatcher(config) {
    this.authenticator = undefined;
    this.controller = undefined;

    ObjectManager.call(this, config);
}

util.inherits(AbstractDispatcher, ObjectManager);

AbstractDispatcher.prototype.initialize = function(config) {
    var extra = this.getComponentConfig('dispatcher');
    this.controller = config.controller || extra.controller || Inflector.pluralize(this.getIdentifier().getPackage()) || undefined;

    this.authenticator = config.authenticator || extra.authenticator || 'core:dispatcher.authenticator.fallback';

    return ObjectManager.prototype.initialize.call(this, config);
};

/**
 * This function will dispatch the request to the correct controller
 *
 * @method dispatch
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 */
AbstractDispatcher.prototype.dispatch = function (req, res) {
    var self = this;

    this.getAuthenticator()
        .then(function(authenticator) {
            return authenticator.authenticate(req);
        })
        .then(function(authenticated) {
            return authenticated;
        })
        .then(function (authenticated) {
            return [self.getController(req), self.parseRequest(req), authenticated];
        })
        .spread(function (controller, data, authenticated) {
            var context         = controller.getContext();
            context.auth        = authenticated;
            context.request     = controller.getRequest();
            context.data        = data;

            return controller.execute(req.method, context);
        })
        .then(function(data) {
            res.setHeader('Content-Type', data.result.mimetype);
            res.statusCode = data.status;

            return data.result.display();

        })
        .then(function(data) {
            return self.GZip(req, res, data);
        })
        .then(function(data) {
            res.end(data);
        })
        .catch(function (error) {
            self.handleException(res, error);
        });
};

/**
 * This function will return the Controller object for the request.
 *
 * @method getController
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 * @returns {Promise} Return the Controller object
 */
AbstractDispatcher.prototype.getController = function (req) {
    var identifier = this.getIdentifier().clone();
    
    return this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(req.url.query.view ? req.url.query.view : this.controller)))
        .then(function(controller) {
            controller.request      = req.url.query;
            controller.request.view = req.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
            controller.format       = (req.url.query.format || Raddish.getConfig('format'));

            return controller;
        });
};

AbstractDispatcher.prototype.getAuthenticator = function() {
    return this.getObject(this.authenticator);
};

/**
 * This function will check if gzip is enabled and supported, if both are correct it will gzip the date and send it to the response.
 *
 * @method GZip
 * @param {Object} data The data object which needs GZipping.
 * @returns {Promise}
 * @constructor
 */
AbstractDispatcher.prototype.GZip = function(req, res, data) {
    if(req.headers['accept-encoding'] && req.headers['accept-encoding'].match(/\bgzip\b/) && Raddish.getConfig('gzip')) {
        return zlib.gzipAsync(data)
            .then(function(data) {
                res.writeHead(res.statusCode, { 'content-encoding': 'gzip' });

                return data;
            });
    } else {
        return Promise.resolve(data);
    }
};

module.exports = AbstractDispatcher;