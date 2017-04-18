'use strict';

var ObjectManager = require('../object/manager'),
    Inflector = require('inflected');

/**
 * This is the abstract behavior class, every behavior in Raddish must extend from this object.
 *
 * @class Behavior
 * @extends ObjectManager
 */
class Behavior extends ObjectManager {
    constructor(config) {
        super(config);

        this.methods = {};
    }

    /**
     * This method will register a function on a callable method.
     *
     * @method registerMethod
     * @param {String} method The method to bind the function to.
     * @param {Function} target The function to execute.
     * @return {Object} The current object for chaining.
     */
    registerMethod(method, target) {
        if(!this.methods[method]) {
            this.methods[method] = target;
        }

        return this;
    }

    /**
     * This method will execute the given method of the behavior.
     *
     * @method execute
     * @param {String} method the method to execute.
     * @param {CommandContext} context The context in which to execute the behavior.
     * @return {CommandContext} The context after the method was executed.
     */
    execute(method, context) {
        method = this.methods[method] || this.getMethod(method);

        if(typeof method === 'string') {
            return this[method](context);
        } else if(typeof method === 'function') {
            return method.call(this, context);
        }

        return Promise.resolve(context);
    }

    /**
     * This method will check if a method exists or a method has been registred to the current call.
     *
     * @method hasMethod
     * @param {String} method The dot-separated identifier of the called method.
     * @return {boolean} True when a method is found, else false.
     */
    hasMethod(method) {
        if(this.methods[method]) {
            return true;
        }

        method = this.getMethod(method);
        return (typeof this[method] === 'function');
    }

    /**
     * This method converts a dot-separated method call to a function name.
     *
     * @method getMethod
     * @param {String} method The dot-separated method name.
     * @return {string} A formatted function name.
     */
    getMethod(method) {
        var parts = method.split('.');

        return '_' + parts.shift() + parts.map(function(item) {
            return Inflector.capitalize(item.toLowerCase());
        }).join('');
    }
}

module.exports = Behavior;