/**
 * This is an abstract Role object to use with the roles.
 * @constructor
 */
function Role() {

}

Role.prototype.getMixableMethods = function() {
    var methods = {};

    for(var index in this) {
        if(typeof this[index] === 'function' && this.hasOwnProperty(index)) {
            methods[index] = this[index];
        }
    }

    return methods;
};

module.exports = Role;