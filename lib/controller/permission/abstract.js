'use strict';

var ObjectManager = require('../../object/manager');

class AbstractPermission extends ObjectManager {
    canGet(context) {
        return true;
    }

    canPost(context) {
        return true;
    }

    canDelete(context) {
        return true;
    }
}

module.exports = AbstractPermission;