var ObjectManger = require('../object/manager'),
    util = require('util'),
    Inflector = require('raddish-inflector');

function AbstractController(config) {
    ObjectManger.call(this, config);

    this.format = '';
    this.model = '';
}

util.inherits(AbstractController, ObjectManger);

AbstractController.prototype._initialize = function(config) {
    this.format = config.format || Inflector.singularize(this.getIdentifier().getPackage());
    this.model = config.model || '';

    return ObjectManager.prototype._initialize.call(this, config);
};

AbstractController.prototype.getModel = function() {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['model']);

    return this.getObject(identifier);
};

AbstractController.prototype.getView = function() {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['view']);

    return this.getObject(identifier);
};

module.exports = AbstractController;