'use strict';

var ObjectManager = require('../object/manager');

/**
 * The AbstractView is the base of all the other view objects.
 * When creating a view you must extend from this object or a child object.
 *
 * @class AbstractView
 */
class AbstractView extends ObjectManager {
    constructor(config) {
        super(config);

        this.contentType = 'text/plain';
    }

    /**
     * The _actionRender method is called on render of the view.
     * All the render specific functions are located in here.
     *
     * This method needs to be overridden per child class.
     *
     * @method _actionRender
     * @private
     */
    _actionRender() {
        throw new Error('This method needs to be overridden!');
    }
}

module.exports = AbstractView;