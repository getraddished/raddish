var Base        = require('../base/base');
var util        = require('util');
var Inflector   = require('../inflector/inflector');

function ControllerAbstract() {

}

util.inherits(ControllerAbstract, Base);

ControllerAbstract.prototype.execute = function(method, context) {
    /**
     * get the command chain.
     * Then run a specialized command for the command chain.
     * This will check in the registred behaviors. and then it will execute the command (which handles the gathering of the data) and then the after call.
     */
    var self = this;

    this.getCommandChain(function(chain) {
        self['_action' + Inflector.capitalize(method.toLowerCase())](context);
    });
};

ControllerAbstract.prototype.initialize = function(config, callback) {
    var self = this;

    Base.prototype.initialize(config, function(done) {
        self.request = config.request;
        self.response = config.response;
        self.layout = (self.request.url.query.layout || self.getConfig('layout'));

        callback(null);
    });
};

ControllerAbstract.prototype.getModel = function(callback) {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return this.getObject(identifier.setPath(['model']), null, function(model) {
        model.set(self.request.url.query);

        callback(model);
    });
};

ControllerAbstract.prototype.getView = function(callback) {
    var identifier = this.getIdentifier().clone();
    var self = this;

    this.getModel(function(model) {
        return self.getObject(identifier.setPath(['view', self.request.url.query.view]).setName(self.layout), {
            request: self.request,
            response: self.response,
            model: model
        }, callback);
    });
};

ControllerAbstract.prototype.getPermissions = function(callback) {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller', 'permission']), null, callback);
};

module.exports = ControllerAbstract;