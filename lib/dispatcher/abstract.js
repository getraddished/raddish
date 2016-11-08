var ObjectManager = require('../object/manager'),
    util = require('util'),
    Inflector = require('raddish-inflector');

function AbstractDispatcher(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractDispatcher, ObjectManager);

/**
 * The _initialize method initializes the dispatcher, this method will set the default controller which is being requested.
 * @param config
 * @returns {*}
 * @private
 */
AbstractDispatcher.prototype._initialize = function(config) {
    config.controller = config.controller || Inflector.singularize(this.getIdentifier().getPackage());

    return ObjectManager.prototype._initialize.call(this, config);
};

AbstractDispatcher.prototype._actionDispatch = function(context) {
    // TODO: Add the view from the request here, else allways a single controller will be requested!
    var identifier = this.getIdentifier().clone().setPath(['controller']).setName((context.request.query.view || this.config.controller));

    return this.getObject(identifier)
        .then(function(controller) {
            return controller.execute(context.method, context);
        })
        .then(function(result) {
            return context.response.end(result);
        });
};

module.exports = AbstractDispatcher;