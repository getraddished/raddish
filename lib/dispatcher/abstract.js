var ObjectManager   = require('../object/manager');
var util            = require('util');
var Inflector       = require('../inflector/inflector');
var zlib            = Promise.promisifyAll(require('zlib'));

function AbstractDispatcher(config) {
    this.authenticator = undefined;
    this.controller = undefined;

    ObjectManager.call(this, config);
};

util.inherits(AbstractDispatcher, ObjectManager);

AbstractDispatcher.prototype.initialize = function(config) {
    var extra = this.getComponentConfig('dispatcher');
    this.controller = config.controller || extra.controller || undefined;

    this.authenticator = config.authenticator || extra.authenticator || 'core:dispatcher.authenticator.fallback';

    return ObjectManager.prototype.initialize.call(this, config);
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
    var self = this;

    // This is a little more nice, i can now just use return, gone callback :D
    this.controller = this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(req.url.query.view || this.controller)))
        .then(function(controller) {
            controller.request = req.url.query;
            controller.format = (req.url.query.format || Raddish.getConfig('format'));

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
    var self = this;

    if(req.headers['accept-encoding'] && req.headers['accept-encoding'].match(/\bgzip\b/) && Raddish.getConfig('gzip')) {
        return zlib.gzipAsync(data)
            .then(function(data) {
                res.writeHead(200, { 'content-encoding': 'gzip' });

                return data;
            });
    } else {
        return Promise.resolve(data);
    }
};

module.exports = AbstractDispatcher;