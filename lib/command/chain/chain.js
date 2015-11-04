"use strict";

/**
 * CommandChain class for the behaviors.
 * This object when created will process the behaviors.
 * This will be done in the way of Chain of Responsibility.
 *
 * @class CommandChain
 * @param {Object} parent Parent object which needs to hold the behaviors.
 * @returns {Promise} With the promised object.
 * @constructor
 */
function CommandChain(parent) {
    this.enabled = false;

    if (parent.behaviors) {
        this.identifier = parent.getIdentifier().clone();
        this.caller = parent;
        this.behaviors = parent.behaviors || {};
        this.enabled = true;
    }
}

/**
 * This method disables the complete command chain.
 *
 * @returns {CommandChain} The commandChain object used for chaining.
 */
CommandChain.prototype.disable = function() {
    this.enabled = false;

    return this;
};

/**
 * This method enables the command Chain.
 *
 * @returns {CommandChain} The commandChain object used for chaining.
 */
CommandChain.prototype.enable = function() {
    this.enabled = true;

    return this;
};

/**
 * This method will run a method in all the behaviors,
 * however this will only be done when the CommandChain is enabled.
 *
 * @method run
 * @param {String} method The name of the behavior method to run (eg: before.run)
 * @param {CommandContext} context The context of the behavior in which it has to run. (DCI)
 * @returns {Promise} When all the behaviors have ran we will return a resolve of the context.
 */
CommandChain.prototype.run = function (method, context) {
    context.caller = this.caller;

    if(this.enabled && this.behaviors) {
        return this.processBehaviors(this.behaviors)
            .then(function(behaviors) {
                var methods = [];

                for(var index in behaviors) {
                    var behavior = behaviors[index];

                    if(behavior.hasMethod(method)) {
                        methods.push(behavior.execute(method, context));
                    }
                }

                return Promise.all(methods);
            })
            .then(function() {
                return context;
            });
    }

    return Promise.resolve(context);
};

/**
 * This method will run in the background and map all the behavior till they are ready to run.
 *
 * @method processBehaviors
 * @returns {Promise} Return the CommandChain object when the behaviors have been processed.
 */
CommandChain.prototype.processBehaviors = function (behaviors) {
    var identifier = this.identifier.clone(),
        path = identifier.getPath(),
        methods = []

    for(var index in behaviors) {
        if (index.indexOf('.') !== -1) {
            methods.push(ObjectManager.get(index, behaviors[index]));
        } else {
            path.push('behavior');
            identifier.setPath(path);

            methods.push(ObjectManager.get(identifier.setName(index), behaviors[index]));
        }
    }

    return Promise.all(methods);
};

module.exports = CommandChain;
