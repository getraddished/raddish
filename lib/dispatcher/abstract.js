var ObjectManager = require('../object/manager'),
    util = require('util'),
    Inflector = require('raddish-inflector');

function AbstractDispatcher(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractDispatcher, ObjectManager);

AbstractDispatcher.prototype._initialize = function(config) {
    config.controller = config.controller || Inflector.singularize(this.getIdentifier().getPackage());

    return ObjectManager.prototype._initialize.call(this, config);
};

AbstractDispatcher.prototype._actionDispatch = function(context) {
    var identifier = this.getIdentifier().clone().setPath(['controller']).setName(this.config.controller);

    return this.getObject(identifier)
        .then(function(controller) {
            return controller.execute(context.method);
        });
};

module.exports = AbstractDispatcher;