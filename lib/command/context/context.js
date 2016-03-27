"use strict";

var Role = require('../role/role'),
    util = require('util');

/**
 * This is the context object which will be passed to every behavior method.
 *
 * @class CommandContext
 * @constructor
 */
function CommandContext(config) {
    this.roles = {};
    this.parameters = {};
}

/**
 * This method adds parameters to the context.
 * This can be done with key, value or by passing in an object as the first parameter.
 *
 * @method setParameter
 * @param {String/ Object} key The key of the parameter to set.
 * @param {*} value The value of the parameter.
 * @return {CommandContext} The current object
 */
CommandContext.prototype.setParameter = function(key, value) {
    if(typeof key === 'string') {
        this.parameters[key] = value;
    } else if(typeof key === 'object') {
        for(var index in key) {
            if(key.hasOwnProperty(index)) {
                this.parameters[index] = key[index];
            }
        }
    }

    return this;
};

/**
 * This method retrieves a parameter.
 *
 * @method getParameter
 * @param {String} key The key of the requwested parameter.
 * @returns {*} The value of the requested parameter.
 */
CommandContext.prototype.getParameter = function(key) {
    return this.parameters[key];
};

/**
 * This method will create a new Role to use in DCI.
 * These roles will only be available in the current context.
 *
 * @method addRole
 * @param {String} name The name of the created role
 * @param {Object} object The object the methods need to be bound to.
 * @param {object} methods The methods which need to be bound to the role.
 */
CommandContext.prototype.addRole = function(name, object, methods) {
    if(!this.roles[name]) {
        if(methods) {
            util.inherits(methods, Role);
            object.mixin(methods);

            this.roles[name] = object;
        } else {
            this.roles[name] = object;
        }
    }
};

/**
 * Returns a single role Object.
 * The returned object will have all the role functions added to it.
 *
 * @method getRole
 * @param {String} name
 * @returns {Object} The role object
 */
CommandContext.prototype.getRole = function(name) {
    return this.roles[name] ? this.roles[name] : {};
};

/**
 * This method will clear the context of all remaining Roles.
 *
 * @method clearRoles
 */
CommandContext.prototype.clearRoles = function() {
    this.roles = {};
};

module.exports = CommandContext;