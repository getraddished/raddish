'use strict';

var ObjectManager = require('../../object/manager');

class AbstractPermission extends ObjectManager {
    canGet() {
        return true;
    }

    canPost() {
        return true;
    }

    canDelete() {
        return true;
    }
}

module.exports = AbstractPermission;