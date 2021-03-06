'use strict';

var ObjectManager = require('../../object/manager');

/**
 * This class holds the basic permissions for the basic requests.
 *
 * @class AbstractPermission
 */
class AbstractPermission extends ObjectManager {
    /**
     * Abstract canGet method.
     *
     * @method canGet
     * @param {Object} request The request object
     * @return {boolean}
     */
    canGet() {
        return true;
    }

    /**
     * Abstract canPost method.
     *
     * @method canPost
     * @param {Object} request The request object
     * @return {boolean}
     */
    canPost() {
        return true;
    }

    /**
     * Abstract canDelete method.
     *
     * @method canDelete
     * @param {Object} request The request object
     * @return {boolean}
     */
    canDelete() {
        return true;
    }
}

module.exports = AbstractPermission;