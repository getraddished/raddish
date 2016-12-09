'use strict';

var AbstractPermission = require('./abstract');

class DefaultPermission extends AbstractPermission {
    canBrowse(context) {
        return true;
    }

    canRead(context) {
        return true;
    }

    canEdit(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }

    canAdd(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }

    canDelete(context) {
        if(context.user.username && context.user.password) {
            return true;
        }

        return false;
    }
}

module.exports = DefaultPermission;