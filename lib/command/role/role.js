/**
 * This is an abstract Role object to use with your roles.
 *
 * @class Role
 * @constructor
 */
function Role() {

}

/**
 * This is a mixin object to ensure that the DCI Role is correctly created.
 *
 * @returns {Object} An object with all the mixable methods.
 */
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