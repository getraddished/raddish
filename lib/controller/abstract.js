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
    var extra = this.getComponentConfig(this.getIdentifier().getType() +'.' + this.getIdentifier().getName());

    if(!config.behaviors && !extra.behaviors) {
        config.behaviors = {};
    } else if(!config.behaviors && extra.behaviors) {
        config.behaviors = extra.behaviors;
    }

    if(config.model || extra.model) {
        this.model = extra.model || config.model;
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
        .then(function() {
            return self.getView()
        })
        .then(function (view) {
            view.setData(context.result);

            return view.display();
        })
        .then(function(data) {
            return data;
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
            return model.set(self.request.url.query);
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

    return this.getModel()
        .then(function(model) {
            return self.getService(identifier.setPath(['view']).setName(self.layout), {
                request: self.request,
                response: self.response,
                model: model
            });
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

    return this.getService(identifier.setPath(['controller', 'permission']), null);
};

module.exports = ControllerAbstract;