var Role = require('../role/role');
var util = require('util');

function CommandContext() {
    this.roles = {};
}

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

CommandContext.prototype.getRole = function(name) {
    return this.roles[name] ? this.roles[name] : {};
};

CommandContext.prototype.clearRoles = function() {
    this.roles = {};
};

module.exports = CommandContext;