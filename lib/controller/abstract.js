"use strict";

var Service     = require('../service/service');
var util        = require('util');
var Inflector   = require('../inflector/inflector');

/**
 * This class holds all the basic function calls from the controller.
 *
 * @class ControllerAbstract
 * @constructor
 */
function ControllerAbstract(config) {
    this.model = undefined;
    this.request = undefined;
    this.response = undefined;
    this.format = undefined;
    this.context = {};

    ControllerAbstract.super_.call(this, config);
}

util.inherits(ControllerAbstract, Service);

/**
 * This function will initialize the controller,
 * it will set the request and response got from the dispatcher.
 *
 * @method initialize
 * @param {Object|null} config Config object for extra configuration.
 * @returns {Promise} The initialized controller object.
 */
ControllerAbstract.prototype.initialize = function (config) {
    var extra = this.getComponentConfig('controller.' + this.getIdentifier().getName());

    if(!config.behaviors && !extra.behaviors) {
        config.behaviors = {};
    } else if(!config.behaviors && extra.behaviors) {
        config.behaviors = extra.behaviors;
    }

    if(config.model || extra.model) {
        this.model = extra.model || config.model;
    }

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

    return self.getPermissions()
        .then(function(permissions) {
            return permissions['can' + Inflector.capitalize(method.toLowerCase())](context);
        })
        .then(function(may) {
            if(!may) {
                throw new RaddishError(401, 'You don\'t have permission to do this.');
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
        .then(function(context) {
            return context.result;
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

    return self.getService(model, null)
        .then(function (model) {
            return model.set(self.getRequest());
        });
};

/**
 * This functionw will return the context of the current controller.
 * @returns {Object} Context object.
 */
ControllerAbstract.prototype.getContext = function() {
    return this.context;
};

/**
 * This function returns the complete request.
 *
 * @returns {Object} The states in the request
 */
ControllerAbstract.prototype.getRequest = function() {
    return this.request;
};

/**
 * This function returns the complete response.
 *
 * @returns {Object} The NodeJS Response object
 */
ControllerAbstract.prototype.getResponse = function() {
    return this.response;
}

/**
 * This function will return the initialize view matching the layout given in the request or on the default
 *
 * @method getView
 * @returns {Promise} The initialized view object
 */
ControllerAbstract.prototype.getView = function () {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return this.getModel()
        .then(function(model) {
            return [self.getService(identifier.setPath(['view']).setName(self.format)), model];
        })
        .spread(function(view, model) {
            view.model = model;
            view.request = self.request;
            view.response = self.response;

            return view;
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

    return this.getService(identifier.setPath(['controller', 'permission']));
};

module.exports = ControllerAbstract;