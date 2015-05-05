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
        this.behaviors = parent.behaviors ? parent.behaviors : {};
        this.identifier = parent.getIdentifier().clone();
        this.caller = parent;
        this.functions = this.processBehaviors();
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
 * @param {String} behavior The name of the behavior to run (eg: before.run)
 * @param {CommandContext} context The context of the behavior in which it has to run. (DCI)
 * @returns {Promise} When all the behaviors have ran we will return a resolve of the context.
 */
CommandChain.prototype.run = function (method, context) {
    context.caller = this.caller;

    if(this.enabled) {
        return Promise.all(this.functions)
            .each(function (behavior) {
                if (behavior.hasMethod(method)) {
                    return behavior.execute(method, context);
                }
            })
            .then(function () {
                return context;
            });
    } else {
        return Promise.resolve(context);
    }
};

/**
 * This method will run in the background and map all the behavior till they are ready to run.
 *
 * @method processBehaviors
 * @returns {Promise} Return the CommandChain object when the behaviors have been processed.
 */
CommandChain.prototype.processBehaviors = function () {
    var identifier = this.identifier.clone(),
        path = this.identifier.getPath(),
        methods = [],
        self = this;

    path.push('behavior');
    identifier.setPath(path);

    return new Promise(function(resolve) {
        for(var index in self.behaviors) {
            if (index.indexOf('.') !== -1) {
                methods.push(ObjectManager.get(index, self.behaviors[index]));
            } else {
                methods.push(ObjectManager.get(identifier.setName(index), self.behaviors[index]));
            }
        }

        return resolve(methods);
    });
};

module.exports = CommandChain;