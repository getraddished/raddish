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

    self['_action' + Inflector.capitalize(method.toLowerCase())](context);
};

ControllerAbstract.prototype.initialize = function(config) {
    var self = this;

    return new Promise(function(resolve, reject) {
        Base.prototype.initialize(config)
            .then(function(controller) {
                self.request = config.request;
                self.response = config.response;
                self.layout = (self.request.url.query.layout || self.getConfig('layout'));

                resolve(self);
            });
    });
};

ControllerAbstract.prototype.getModel = function() {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return new Promise(function(resolve, reject) {
        self.getObject(identifier.setPath(['model']), null)
            .then(function(model) {
                resolve(model.set(self.request.url.query));
            });
    });
};

ControllerAbstract.prototype.getView = function() {
    var identifier = this.getIdentifier().clone();
    var self = this;

    return new Promise(function(resolve, reject) {
        self.getModel()
            .then(function(model) {
                resolve(self.getObject(identifier.setPath(['view']).setName(self.layout), {
                    request: self.request,
                    response: self.response,
                    model: model
                }));
            });
    });
};

ControllerAbstract.prototype.getPermissions = function(callback) {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller', 'permission']), null);
};

module.exports = ControllerAbstract;