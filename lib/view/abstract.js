'use strict';

var ObjectManager = require('../object/manager');

class AbstractView extends ObjectManager {
    constructor(config) {
        super(config);

        this.contentType = 'text/plain';
    }

    _actionRender(context) {
        throw new Error('This method needs to be overridden!');
    }
}

module.exports = AbstractView;