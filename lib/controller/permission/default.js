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
        return true;
    }

    canAdd(context) {
        return true;
    }

    canDelete(context) {
        return false;
    }
}

module.exports = DefaultPermission;