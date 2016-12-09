'use strict';

var AbstractView = require('./abstract');

class JsonView extends AbstractView {
    constructor(config) {
        super(config);

        this.data = null;
    }

    _actionRender(context) {
        var data = {
            data: context.data.getData() || {},
            states: context.model.state.states
        };

        return Promise.resolve(JSON.stringify(data));
    }
}

module.exports = JsonView;