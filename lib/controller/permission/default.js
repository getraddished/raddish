'use strict';

var AbstractPermission = require('./abstract');

class DefaultPermission extends AbstractPermission {
    canBrowse() {
        return true;
    }

    canRead() {
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