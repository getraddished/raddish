var ObjectManager = require('../object/manager'),
    util = require('util');

function AbstractDispatcher(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractDispatcher, ObjectManager);

AbstractDispatcher.prototype._initialize = function(config) {
    config.controller = config.controller || this.getIdentifier().getName();

    return ObjectManager.prototype._initialize.call(this, config);
};

AbstractDispatcher.prototype._actionDispatch = function(context) {
    // We now know the component.

    context.response.end('Called!');
};

module.exports = AbstractDispatcher;