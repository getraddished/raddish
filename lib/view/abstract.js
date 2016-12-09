'use strict';

var ObjectManager = require('../object/manager');

class AbstractView extends ObjectManager {
    _actionRender(context) {
        throw new Error('This method needs to be overridden!');
    }
}

module.exports = AbstractView;