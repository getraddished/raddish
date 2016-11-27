var ObjectManager = require('../object/manager'),
    util = require('util'),
    Inflector = require('raddish-inflector'),
    Raddish = require('../raddish/raddish').getInstance();

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

AbstractDispatcher.prototype.getController = function(view, format) {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['controller'])
        .setName(view);

    return this.getObject(identifier, {
        format: format
    });
};

AbstractDispatcher.prototype._actionDispatch = function(context) {
    var identifier = this.getIdentifier(),
        view = context.request.query.view || Inflector.pluralize(this.config.controller),
        format = context.request.query.format || Raddish.getConfig('format');

    return this.getController(view)
        .then(function(controller) {
            return controller.execute(context.method, context);
        })
        .then(function(result) {
            return context.response.end(result);
        });
};

module.exports = AbstractDispatcher;