'use strict';

var AbstractDispatcher = require('./abstract');

class HttpDispatcher extends AbstractDispatcher {
    /**
     * The _actionDispatch method will set the method of the request to the context.
     * It is possible to override the default by sending the _action post variable (corresponding with the method name).
     *
     * @method _actionDispatch
     * @param {Object} context The object holding the complete context.
     * @returns {*}
     * @private
     */
    _actionDispatch(context) {
        context.method = (context.request.data._action || context.request.method).toLowerCase();

        return super._actionDispatch(context);
    }
}

module.exports = HttpDispatcher;