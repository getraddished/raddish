'use strict';

var Behavior = require('../../../../../../index').Behavior;

class Viewable extends Behavior {
    _beforeRender(context) {
        console.log('Called before render!');

        return Promise.resolve(context);
    }
}

module.exports = Viewable;