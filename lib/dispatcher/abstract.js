var ObjectManager   = require('../object/manager'),
    util            = require('util'),
    Inflector       = require('../inflector/inflector'),
    zlib            = require('zlib'),
    Formidable      = require('formidable'),
    RaddishStream   = require('../stream/stream');

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

/**
 * An initialize method override.
 * In here the dispatcher check if the controller and authenticator is set in the component or the config object.
 *
 * @param {Object} config The config object.
 * @returns {Promise} The resolve object.
 */
AbstractDispatcher.prototype.initialize = function(config) {
    var extra = this.getComponentConfig('dispatcher');

    this.controller = config.controller || extra.controller || Inflector.pluralize(this.getIdentifier().getPackage());
    this.authenticator = config.authenticator || extra.authenticator || 'core:dispatcher.authenticator.fallback';

    return ObjectManager.prototype.initialize.call(this, config);
};

/**
 * This method will dispatch the request to the correct controller.
 *
 * @method dispatch
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 * @return {Promise} The promise with the parsed content.
 */
AbstractDispatcher.prototype.dispatch = function (req, res) {
    var self = this;

    return this.getAuthenticator()
        .then(function(authenticator) {
            return authenticator.authenticate(req);
        })
        .then(function (authenticated) {
            return self.getController();
        })
        .then(function(controller) {
            return Promise.all([
                self.parseRequest(req),
                controller.getRequest()
            ]);
        })
        .then(function(result) {
            var context         = controller.getContext();
            context.auth        = authenticated;
            context.request     = result[0];
            context.data        = result[1];

            return controller.execute(data.fields.action || req.method, context);
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
    if(this.authenticator.indexOf(':') === -1 ) {
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
    var form = new Formidable.IncomingForm();

    return new Promise(function(resolve, reject) {
        form.parse(req, function(err, fields, files) {
            if(err) {
                return reject(err);
            }

            return resolve({
                fields: fields,
                files: files
            });
        })
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
    if(typeof data.pipe !== 'function') {
        var stream = new RaddishStream();
        stream.cast(data)
        data = stream.stream;
    }

    if(req.headers['accept-encoding'] && req.headers['accept-encoding'].match(/\bgzip\b/) && Raddish.getConfig('gzip')) {
        var gzip = zlib.createGzip();

        res.setHeader('content-encoding', 'gzip');
        return Promise.cast(data.pipe(gzip));
    } else {
        return Promise.cast(data);
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
        response.setHeader('Content-Type', 'application/json');
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
