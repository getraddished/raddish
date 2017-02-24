'use strict';

var AbstractPermission = require('./abstract');

/**
 * The DefaultPermissions object holds more checks for permissions.
 *
 * @class DefaultPermissions.
 */
class DefaultPermission extends AbstractPermission {
    /**
     * Abstract canBrowse method.
     *
     * @method canBrowse
     * @param {Object} request The request object
     * @return {boolean}
     */
    canBrowse() {
        return true;
    }

    /**
     * Abstract canRead method.
     *
     * @method canRead
     * @param {Object} request The request object
     * @return {boolean}
     */
    canRead() {
        return true;
    }

    /**
     * Abstract canEdit method.
     *
     * @method canEdit
     * @param {Object} request The request object
     * @return {boolean}
     */
    canEdit(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }

    /**
     * Abstract canAdd method.
     *
     * @method canAdd
     * @param {Object} request The request object
     * @return {boolean}
     */
    canAdd(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }

    /**
     * Abstract canDelete method.
     *
     * @method canDelete
     * @param {Object} request The request object
     * @return {boolean}
     */
    canDelete(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }
}

module.exports = DefaultPermission;