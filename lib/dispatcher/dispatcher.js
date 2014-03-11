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
    var form = new Formidable.IncomingForm();

    this.getController(req, res, function(controller) {
        form.parse(req, function(err, fields, files) {
            return controller.execute(req.method, {
                fields: fields,
                files: files
            });
        });
    });
};

Dispatcher.prototype.getController = function(req, res, callback) {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(req.url.query.view)), {
        request: req,
        response: res
    }, callback);
};

module.exports = Dispatcher;