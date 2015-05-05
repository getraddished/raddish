var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    Inflector       = require('../../inflector/inflector');

/**
 * This is the base class for every behavior,
 * this holds the basic methods to let your behavior function properly.
 *
 * @class CommandBehavior
 * @extends ObjectManager
 * @param config
 * @constructor
 */
function CommandBehavior(config) {
    ObjectManager.call(this, config);

    this.methods    = {};
    this.config     = {};
}

util.inherits(CommandBehavior, ObjectManager);

/**
 * Initialize override to allow the config to be used globally.
 *
 * @private
 * @method initialize
 * @param {Object} config The complete config object
 * @returns {Object} The complete initialized object
 */
CommandBehavior.prototype.initialize = function(config) {
    this.config = config;

    return ObjectManager.prototype.initialize.call(this, config);
};

/**
 * This method accepts an array or string as action parameter and will
 * connect this action to a given method.
 *
 * @method registerMethod
 * @param {Array|String} action The action or collection of actions to bind your method to.
 * @param {Function} method The function to call on the specified action(s).
 */
CommandBehavior.prototype.registerMethod = function(action, method) {
    if(typeof action.push === 'function') {
        for(var index in action) {
            this.registerMethod(action[index], method);
        }
    } else {
        if(!this.methods[action]) {
            this.methods[action] = method;
        }
    }
};

/**
 * This method will check if the function exists in the current behavior, if so it will return true,
 *
 * @method hasMethod
 * @param {String} method The method name to check on.
 * @returns {boolean} The function exists or not.
 */
CommandBehavior.prototype.hasMethod = function(method) {
    if(this.methods[method]) {
        return true;
    }

    method = this.getMethod(method);
    if(typeof this[method] === 'function') {
        return true;
    }

    return false;
};

/**
 * This method will execute the given method,
 * and will also give the given context over to the called method.
 *
 * @method execute
 * @param {String} method The method name to execute, this is dot-separated
 * @param {CommandContext} context The context object to use in the method call.
 * @returns {CommandContext} The context object, which has gone through all the behaviors.
 */
CommandBehavior.prototype.execute = function(method, context) {
    if(this.methods[method]) {
        method = this.methods[method];
    } else {
        method = this.getMethod(method);
    }

    if(typeof method === 'string') {
        return this[method](context);
    } else if(typeof method === 'function') {
        return method.call(this, context);
    }
};

/**
 * Convert the action name to a function name.
 *
 * @private
 * @method getMethod
 * @param {String} method The dot-separated name of the behavior
 * @returns {string} The behavior name as function name.
 */
CommandBehavior.prototype.getMethod = function(action) {
    var parts = action.split('.');
    parts = parts.map(function(value) {
        return Inflector.capitalize(value.toLowerCase());
    });

    return 'on' + parts.join('');
};

/**
 * Save method which will save the current object.
 * This method will disable the commandChain connected to this object.
 *
 * @param {CommandContext} context The context object to use.
 * @returns {Promise} The context with a saved object.
 */
CommandBehavior.prototype.save = function(context) {
    var chain = context.data.table.getCommandChain();
    chain.disable();

    return context.data.save()
        .then(function() {
            chain.enable();

            return context;
        });
};

/**
 * Delete method which will save the current object.
 * This method will disable the commandChain connected to this object.
 *
 * @param {CommandContext} context The context object to use.
 * @returns {Promise} The context with a deleted object.
 */
CommandBehavior.prototype.delete = function(context) {
    var chain = context.data.table.getCommandChain();
    chain.disable();

    return context.data.delete()
        .then(function() {
            chain.enable();

            return context;
        });
};

module.exports = CommandBehavior;