var ObjectManager   = require('../../object/manager'),
    util            = require('util');

/**
 * Abstract permission object,
 * Won't be directly used in development.
 *
 * This object holds the basic permissions for the framework
 *
 * @extends ObjectManager
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
 * @method canGet
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
 * @method canPost
 * @param {Object} context The context object with authentication information.
 * @returns {Promise}
 */
AbstractPermission.prototype.canPost = function(context) {
    return Promise.resolve(true);
};

/**
 * Basic permissions for a PUT request,
 * This function is here for basic purposes.
 *
 * @method canPut
 * @param {Object} context The context object with authentication information.
 * @returns {Promise}
 */
AbstractPermission.prototype.canPut = function(context) {
    return Promise.resolve(true);
};

/**
 * Basic permissions for a PATCH request,
 * This function is here for basic purposes.
 *
 * @method canPatch
 * @param {Object} context The context object with authentication information.
 * @returns {Promise}
 */
AbstractPermission.prototype.canPatch = function(context) {
    return Promise.resolve(true);
};

module.exports = AbstractPermission;