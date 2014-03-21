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
    var defer = Q.defer();
    var self = this;


    Base.prototype.initialize(config)
        .then(function(controller) {
            self.request = config.request;
            self.response = config.response;
            console.log(self.request.url);
            self.layout = (self.request.url.query.layout || self.getConfig('layout'));

            defer.resolve(self);
        });

        return defer.promise;
};

ControllerAbstract.prototype.getModel = function() {
    var defer = Q.defer();
    var identifier = this.getIdentifier().clone();
    var self = this;

    self.getObject(identifier.setPath(['model']), null)
        .then(function(model) {
            defer.resolve(model.set(self.request.url.query));
        });

    return defer.promise;
};

ControllerAbstract.prototype.getView = function() {
    var defer = Q.defer();
    var identifier = this.getIdentifier().clone();
    var self = this;

    console.log(self.layout);

    self.getModel()
        .then(function(model) {
            defer.resolve(self.getObject(identifier.setPath(['view']).setName(self.layout), {
                request: self.request,
                response: self.response,
                model: model
            }));
        });
        
    return defer.promise;
};

ControllerAbstract.prototype.getPermissions = function(callback) {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller', 'permission']), null);
};

module.exports = ControllerAbstract;