var ObjectManager   = require('../../object/manager');
var util            = require('util');
var Inflector       = require('../../inflector/inflector');

function CommandBehavior(config) {
    ObjectManager.call(this, config);

    this.roles      = {};
    this.methods    = {};
    this.config     = {};
}

util.inherits(CommandBehavior, ObjectManager);

CommandBehavior.prototype.initialize = function(config) {
    this.config = config;

    return ObjectManager.prototype.initialize.call(this, config);
};

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
 * @method getName
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

module.exports = CommandBehavior;