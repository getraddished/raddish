var Base        = require('../base/base');
var util        = require('util');
var Inflector   = require('../inflector/inflector');
var Formidable  = require('formidable')

function Dispatcher() {
    Dispatcher.super_.apply(this, arguments);
}

util.inherits(Dispatcher, Base);

Dispatcher.prototype.dispatch = function(req, res) {
    // Here the real-world test will commence
    var self = this;

    // TODO: Still have to fix this part.
    this.getController(req, res)
        .then(function(controller) {
            self.controller = controller;

            return self.parseRequest(req);
        })
        .then(function(data) {
            return self.controller.execute(req.method, data);
        })
        .catch(function(error) {
            console.log(error);
        });
};

Dispatcher.prototype.parseRequest = function(req) {
    var defer = Q.defer();

    
    var form = new Formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        defer.resolve({
            fields: fields,
            files: files
        });
    });

    return defer.promise;
};

Dispatcher.prototype.getController = function(req, res) {
    var identifier = this.getIdentifier().clone();

    // This is a little more nice, i can now just use return, gone callback :D
    return this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(req.url.query.view)), {
        request: req,
        response: res
    });
};

module.exports = Dispatcher;