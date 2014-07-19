var ObjectManager   = require('../../object/manager');
var util            = require('util');

/**
 * Abstract permission object,
 * Won't be directly used in development.
 *
 * This object holds the basic permissions for the framework
 *
 * @param {Object} config The config object.
 */
function AbstractPermission(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractPermission, ObjectManager);

/**
 * Basic permissions for a GET request,
 * This function is here for basic purposes.
 *
 * @param {Object} context The context object with authentication information.
 * @returns {Promise}
 */
AbstractPermission.prototype.canGet = function(context) {
    return Promise.resolve(true);
};

/**
 * Basic permissions for a POST request,
 * This function is here for basic purposes.
 *
 * @param {Object} context The context object with authentication information.
 * @returns {Promise}
 */
AbstractPermission.prototype.canPost = function(context) {
    return Promise.resolve(true);
};

module.exports = AbstractPermission;