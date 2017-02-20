'use strict';

var ObjectManager = require('../../object/manager');

/**
 * This class holds the basic permissions for the basic requests.
 *
 * @class AbstractPermissions.
 */
class AbstractPermission extends ObjectManager {
    /**
     * Abstract canGet method.
     *
     * @param {Object} request The request object
     * @return {boolean}
     */
    canGet() {
        return true;
    }

    /**
     * Abstract canPost method.
     *
     * @param {Object} request The request object
     * @return {boolean}
     */
    canPost() {
        return true;
    }

    /**
     * Abstract canDelete method.
     *
     * @param {Object} request The request object
     * @return {boolean}
     */
    canDelete() {
        return true;
    }
}

module.exports = AbstractPermission;