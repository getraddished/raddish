var ObjectManager   = require('../../object/manager');
var util            = require('util');
var Inflector       = require('../../inflector/inflector');

function CommandBehavior(config) {
    ObjectManager.call(this, config);
    
    this.roles = {};
    this.methods = {};
}

util.inherits(CommandBehavior, ObjectManager);

CommandBehavior.prototype.addRole = function(name, value) {
    if(!this.roles[name]) {
        this.roles[name] = value;
    }
};

CommandBehavior.prototype.getRole = function(name) {
    return this.roles[name] ? this.roles[name] : {};
};

CommandBehavior.prototype.registerMethod = function(action, method) {
    
};

CommandBehavior.prototype.hasMethod = function(method) {
    if(this.methods[method]) {
        return true;
    }
    
    var method = this.getMethod(method);
    if(typeof this[method] == 'function') {
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
    
    return this[method](context);
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