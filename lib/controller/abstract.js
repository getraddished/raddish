"use strict";

var ObjectManager   = require('../object/manager'),
    util            = require('util'),
    Inflector       = require('../inflector/inflector'),
    CommandContext  = require('../command/context/context');

/**
 * This class holds all the basic function calls from the controller.
 *
 * @class AbstractController
 * @extends ObjectManager
 * @constructor
 */
function AbstractController(config) {
    this.model = undefined;
    this.request = {};
    this.format = '';
    this.context = new CommandContext();

    ObjectManager.call(this, config);
}

util.inherits(AbstractController, ObjectManager);

/**
 * This function will initialize the controller,
 * it will set the request and response got from the dispatcher.
 *
 * @method initialize
 * @param {Object|null} config Config object for extra configuration.
 * @returns {Promise} The initialized controller object.
 */
AbstractController.prototype.initialize = function (config) {
    var extra = this.getComponentConfig('controller.' + this.getIdentifier().getName());

    if(!config.behaviors && !extra.behaviors) {
        config.behaviors = {};
    } else if(!config.behaviors && extra.behaviors) {
        config.behaviors = extra.behaviors;
    }

    if(config.model || extra.model) {
        this.model = extra.model || config.model;
    }

    return ObjectManager.prototype.initialize.call(this, config);
};

/**
 * Execute function will execute a command given the method.
 * This command will use the context for the behaviors.
 *
 * @method execute
 * @param {String} method Name of the action to execute.
 * @param {Object} context Data got from the request.
 */
AbstractController.prototype.execute = function (method, context) {
    var self = this,
        chain = this.getCommandChain();
    method = method.toLowerCase();

    return self.getPermissions()
        .then(function(permissions) {
            return permissions['can' + Inflector.capitalize(method)](context);
        })
        .then(function(may) {
            if(!may) {
                throw new RaddishError(401, 'You don\'t have permission to do this.');
            } else {
                return chain.run('initialize.' + method, context);
            }
        })
        .then(function(context) {
            return chain.run('before.' + method, context);
        })
        .then(function(context) {
            return self['_action' + Inflector.capitalize(method.toLowerCase())](context);
        })
        .then(function(context) {
            return chain.run('after.' + method, context);
        })
        .then(function(context) {
            context.clearRoles();

            return context;
        });
};

/**
 * The forward method forwards the complete context to another action.
 * THis will return the promise for that specific action.
 *
 * @method forward
 * @param {String} method The method to forward to.
 * @param {Object} context The context specified for that method.
 * @returns {Promise} The promise for the specified method.
 */
AbstractController.prototype.forward = function(method, context) {
    return this.execute(method, context);
};

/**
 * This function returns the model matching the controller name.
 * Also this method will automatically set the states.
 *
 * @method getModel
 * @returns {Promise} The initialized model object with set states
 */
AbstractController.prototype.getModel = function () {
    var model = this.model || this.getIdentifier().clone().setPath(['model']);
    var self = this;

    return self.getObject(model, null)
        .then(function (model) {

            return self.getRequest()
                .then(function(request) {
                    return model.set(request);
                })
            return [model, self.getRequest()];
        });
};

/**
 * This function will return the context of the current controller.
 *
 * @method getContext
 * @returns {CommandContext} Context object.
 */
AbstractController.prototype.getContext = function() {
    return this.context;
};

/**
 * This method returns the complete request.
 *
 * @method getRequest
 * @returns {Object} The states in the request
 */
AbstractController.prototype.getRequest = function() {
    return Promise.resolve(this.request);
};

/**
 * This method will return the initialize view matching the format given in the request or on the default.
 *
 * @method getView
 * @returns {Promise} The initialized view object
 */
AbstractController.prototype.getView = function () {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return this.getModel()
        .then(function(model) {
            if(ObjectLoader.require(identifier.setPath(['view', self.getIdentifier().getName()]).setName(self.format))) {
                return self.getObject(identifier.setPath(['view', self.getIdentifier().getName()]).setName(self.format));
            }

            return self.getObject(identifier.setPath(['view']).setName(self.format))
                .then(function(view) {
                    return self.getRequest()
                        .then(function(request) {
                            view.model = model;
                            view.request = request;

                            return view;
                        })
                })
        });
};

/**
 * This method returns the permission set of the current controller.
 *
 * @method getPermissions
 * @returns {Promise} The complete permissions set
 */
AbstractController.prototype.getPermissions = function () {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller', 'permission']));
};

module.exports = AbstractController;
