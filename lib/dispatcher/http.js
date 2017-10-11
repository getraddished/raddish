'use strict';

var AbstractDispatcher = require('./abstract');

/**
 * The HttpDispatcher will only check a single post variable.
 *
 * @class HttpDispatcher
 * @extends AbstractDispatcher
 */
class HttpDispatcher extends AbstractDispatcher {
    /**
     * The _actionDispatch method will set the method of the request to the context.
     * It is possible to override the default by sending the _action post variable (corresponding with the method name in the controller).
     *
     * eg: sending _action test in a request will call the _actionTest in the controller.
     *
     * @method _actionDispatch
     * @param {Object} context The object holding the complete context.
     * @returns {Promise} A promise containing the closed request object.
     * @private
     */
    _actionDispatch(context) {
        context.method = (context.request.body._action || context.request.method).toLowerCase();

        return super._actionDispatch(context);
    }
}

module.exports = HttpDispatcher;