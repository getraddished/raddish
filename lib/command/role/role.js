/**
 * This is an abstract Role object to use with the roles.
 * @constructor
 */
function Role() {
    this.object = {};
}

Role.prototype.addObject = function(object) {
    this.object = object;
    
    return this;
};

module.exports = Role;