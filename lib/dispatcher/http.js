var AbstractDispatcher = require('./abstract'),
    util = require('util');

function HttpDispatcher(config) {
    AbstractDispatcher.call(this, config);
}

util.inherits(HttpDispatcher, AbstractDispatcher);

/**
 * The _actionDispatch method will set the method of the request to the context.
 * It is possible to override the default by sending the _action post variable (corresponding with the method name).
 *
 * @param {Object} context The object holding the complete context.
 * @returns {*}
 * @private
 */
HttpDispatcher.prototype._actionDispatch = function(context) {
    context.method = (context.request.data._action || context.request.method).toLowerCase();

    return AbstractDispatcher.prototype._actionDispatch.call(this, context)
        .then(function(result) {
            console.log(result);
            return context.response.end(result);
        });
};

module.exports = HttpDispatcher;