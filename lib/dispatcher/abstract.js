var ObjectManager   = require('../object/manager'),
    util            = require('util'),
    Inflector       = require('../inflector/inflector'),
    zlib            = Promise.promisifyAll(require('zlib')),
    Formidable      = require('formidable');

/**
 * This is the abstract dispatcher
 * This class contains the default methods.
 *
 * @class AbstractDispatcher
 * @extends ObjectManager
 * @param config
 * @constructor
 */
function AbstractDispatcher(config) {
    this.authenticator = undefined;
    this.controller = undefined;

    ObjectManager.call(this, config);
}

util.inherits(AbstractDispatcher, ObjectManager);

AbstractDispatcher.prototype.initialize = function(config) {
    var extra = this.getComponentConfig('dispatcher');
    
    this.controller = config.controller || extra.controller || Inflector.pluralize(this.getIdentifier().getPackage());
    this.authenticator = config.authenticator || extra.authenticator || 'core:dispatcher.authenticator.fallback';

    return ObjectManager.prototype.initialize.call(this, config);
};

/**
 * This method will dispatch check the view parameter and get the correct controller,
 * after this the correct action is ran.
 *
 * @method dispatch
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 * @return {Promise} The promise with the controller as content.
 */
AbstractDispatcher.prototype.dispatch = function (req, res) {
    var self = this;

    return this.getAuthenticator()
        .then(function(authenticator) {
            return authenticator.authenticate(req);
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
        });
};

/**
 * This method will return the Controller object for the request.
 *
 * @method getController
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 * @returns {Promise} Return the Controller object.
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

/**
 * Get the authenticator belonging to the current dispatcher.
 *
 * @method getAuthenticator
 * @returns {Promise} The promised authenticator
 */
AbstractDispatcher.prototype.getAuthenticator = function() {
    if(this.authenticator.indexOf(':') == -1 ) {
        var name = this.authenticator;
        var path = this.getIdentifier().getPath();
        path.push('authenticator');
        
        this.authenticator = this.getIdentifier().clone().setPath(path).setName(name);
    }
    
    return this.getObject(this.authenticator);
};

/**
 * This method will parse the request and returns the fields and files send in the request.
 *
 * @method parseRequest
 * @param {Object} req NodeJS Request Object
 * @returns {Promise} Return the POST data and Files
 */
AbstractDispatcher.prototype.parseRequest = function (req) {
    var form = Promise.promisifyAll(new Formidable.IncomingForm());

    return form.parseAsync(req)
        .spread(function (fields, files) {
            return {
                fields: fields,
                files: files
            };
        });
};

/**
 * This method will check if gzip is enabled and supported, if both are true it will gzip the data and send it to the response.
 *
 * @method GZip
 * @param {Object} req The NodeJS request object
 * @param {Object} res The NodeJS response object
 * @param {Object} data The data object which needs GZipping.
 * @returns {Promise} The encoded response.
 * @private
 */
AbstractDispatcher.prototype.GZip = function(req, res, data) {
    if(req.headers['accept-encoding'] && req.headers['accept-encoding'].match(/\bgzip\b/) && Raddish.getConfig('gzip')) {
        return zlib.gzipAsync(data)
            .then(function(data) {
                res.setHeader('content-encoding', 'gzip');

                return data;
            });
    } else {
        return Promise.resolve(data);
    }
};

/**
 * This method will handle the exceptions thrown in the framework,
 * if it is an instance of RaddishError it will return it to the browser.
 *
 * @method handleException
 * @param {Object} response NodeJS request object.
 * @param {Object} error The error object.
 */
AbstractDispatcher.prototype.handleException = function(response, error) {
    if(error instanceof RaddishError) {
        response.statusCode = error.code;
        response.end(JSON.stringify({
            'code': error.code,
            'message': error.message,
            'stack': error.stack
        }));
    } else {
        // Return the default error value.
        console.log(error.stack);
        process.exit(1);
    }
};

module.exports = AbstractDispatcher;