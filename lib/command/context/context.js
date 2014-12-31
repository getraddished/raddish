var Role = require('../role/role'),
    util = require('util');

/**
 * This is the context object which will be passed to every behavior method.
 *
 * @class CommandContext
 * @constructor
 */
function CommandContext() {
    this.roles = {};
}

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