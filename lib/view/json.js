'use strict';

var AbstractView = require('./abstract');

/**
 * The JsonView class will output all the content to a simple JSON string.
 *
 * @class JsonView
 */
class JsonView extends AbstractView {
    constructor(config) {
        super(config);

        this.contentType = 'application/json';
    }

    /**
     * This method renders all the recieved data to JSON.
     *
     * @method _actionRender
     * @private
     */
    _actionRender(context) {
        var data = {
            data: context.data ? context.data.getData() : {},
            states: context.model ? context.model.state.states : []
        };

        return Promise.resolve(JSON.stringify(data));
    }
}

module.exports = JsonView;