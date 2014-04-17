var Base        = require('../base/base');
var util        = require('util');
var Inflector   = require('../inflector/inflector');

/**
 * This class holds all the basic function calls from the controller.
 *
 * @class ControllerAbstract
 * @constructor
 */
function ControllerAbstract() {
    ControllerAbstract.super_.apply(this, arguments);
}

util.inherits(ControllerAbstract, Base);

/**
 * This function will initialize the controller,
 * it will set the request and response got from the dispatcher.
 *
 * @method initialize
 * @param {Object|null} config Config object for extra configuration.
 * @returns {Promise} The initialized controller object.
 */
ControllerAbstract.prototype.initialize = function (config) {
    if(!config.behaviors) {
        config.behaviors = [];
    }

    if(config.model) {
        this.model = config.model;
    }

    this.request = config.request;
    this.response = config.response;
    this.layout = (this.request.url.query.layout || this.getConfig('layout'));

    return ControllerAbstract.super_.prototype.initialize.call(this, config);
};

/**
 * Execute function will execute a command given the method.
 * This command will use the context for the behaviors.
 *
 * @method execute
 * @param {String} method Name of the action to execute.
 * @param {Object} context Data got from the request.
 */
ControllerAbstract.prototype.execute = function (method, context) {
    var self = this;
    var localChain = undefined;

    return new Promise(function(resolve, reject) {
        self.getPermissions()
            .then(function(permissions) {
                return permissions['can' + Inflector.capitalize(method.toLowerCase())](context);
            })
            .then(function(may) {
                if(!may) {
                    self.response.statusCode = 401;
                    self.response.end(JSON.stringify({
                        status: 401,
                        error: 'You don\'t have permission to do this.'
                    }));
                } else {
                    return self.getCommandChain();
                }
            })
            .then(function(chain) {
                localChain = chain;
                return chain.run('before.' + method, context);
            })
            .then(function(context) {
                return self['_action' + Inflector.capitalize(method.toLowerCase())](context);
            })
            .then(function(context) {
                return localChain.run('after.' + method, context);
            })
            .then(function() {
                return self.getView()
            })
            .then(function (view) {
                view.setData(context.result);

                return view.display();
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

/**
 * This function returns the model matching the controller name.
 * Also this method will automatically set the states.
 *
 * @method getModel
 * @returns {Promise} The initialized model object with set states
 */
ControllerAbstract.prototype.getModel = function () {
    var model = this.model || this.getIdentifier().clone().setPath(['model']);
    var self = this;

    return new Promise(function (resolve, reject) {
        self.getObject(model, null)
            .then(function (model) {
                resolve(model.set(self.request.url.query));
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

/**
 * This function will return the initialize view matching the layout given in the request or on the default
 *
 * @method getView
 * @returns {Promise} The initialized view object
 */
ControllerAbstract.prototype.getView = function () {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return this.getObject(identifier.setPath(['view']).setName(self.layout), {
        request: self.request,
        response: self.response
    });
};

/**
 * This function returns the permission set of the current controller.
 * This function has not been implemented as of yet.
 *
 * @method getPermissions
 * @returns {Promise} The complete permissions set
 */
ControllerAbstract.prototype.getPermissions = function () {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller', 'permission']), null);
};

module.exports = ControllerAbstract;