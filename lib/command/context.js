'use strict';

var util = require('util'),
    Role = require('./role');

/**
 * The CommandContext method is a convenience wrapper around a simple object.
 * This object allows for setting default properties and will also be able to interact with this object.
 *
 * @class CommandContext
 */
class CommandContext {
    constructor(properties) {
        this.properties = properties || {};
        this.roles = {};
    }

    /**
     * The addRole method will add a role to the current context.
     * This role is only available for the current context, when a new one is generated/ created all the roles will be reset.
     *
     * @method addRole
     * @param {String} name The name of the role.
     * @param {Object} object The object being presented the role.
     * @param {Object} methods The custom methods for the presented role.
     * @returns {CommandContext} The current context object.
     */
    addRole(name, object, methods) {
        if(methods) {
            util.inherits(methods, Role);
            object.mixin(methods);

            this.roles[name] = object;
        } else {
            this.roles[name] = object;
        }

        return this;
    }

    /**
     * The getRole method returns the requested role.
     * When the role isn't declared it will throw an error.
     *
     * @method getRole
     * @param {String} name The requested role.
     * @returns {Object} The requested role.
     */
    getRole(name) {
        if(!this.roles[name]) {
            throw new Error('The role: ' + name + ' isn\'t defined!');
        }

        return this.roles[name];
    }

    /**
     * The clearRoles method will clear the roles from the current context.
     *
     * @method clearRoles
     * @returns {CommandContext} The current context object.
     */
    clearRoles() {
        this.roles = {};

        return this;
    }

    /**
     * The setProperty method will set a property with a value,
     * when given an array to the property argument all the properties will be set.
     *
     * When an array is given as the property the value property will be ignored.
     *
     * @method setProperty
     * @param {String| Array} property The propert(y/ies) to set.
     * @param {*} value The value of the property to set.
     * @returns {CommandContext}
     */
    setProperty(property, value) {
        if(typeof property !== 'string') {
            for(var index of Object.keys(property)) {
                this.setProperty(index, property[index]);
            }
        } else {
            this.properties[property] = value;
        }

        return this;
    }

    /**
     * This method will return a property, only when set.
     * If the property isn't set then false will be returned.
     *
     * @method getProperty
     * @param {String} property The property to return
     * @returns {*} The found property or false.
     */
    getProperty(property) {
        if(this.properties[property]) {
            return this.properties[property];
        }

        return false;
    }
}

module.exports = CommandContext;