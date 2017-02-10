'use strict';

var AbstractPermission = require('./abstract');

class DefaultPermission extends AbstractPermission {
    /**
     * Abstract canBrowse method.
     *
     * @param {Object} request The request object
     * @return {boolean}
     */
    canBrowse() {
        return true;
    }

    /**
     * Abstract canRead method.
     *
     * @param {Object} request The request object
     * @return {boolean}
     */
    canRead() {
        return true;
    }

    /**
     * Abstract canEdit method.
     *
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