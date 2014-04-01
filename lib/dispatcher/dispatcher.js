var Base        = require('../base/base');
var util        = require('util');
var Inflector   = require('../inflector/inflector');
var Formidable  = require('formidable')

/**
 * Dispatcher class which will dispatch the request to the appropriate controller.
 *
 * @class Dispatcher
 * @constructor
 */
function Dispatcher() {
    Dispatcher.super_.apply(this, arguments);
}

util.inherits(Dispatcher, Base);

/**
 * This function will dispatch the request to the correct controller
 *
 * @method dispatch
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 */
Dispatcher.prototype.dispatch = function (req, res) {
    // Here the real-world test will commence
    var self = this;

    // TODO: Still have to fix this part.
    this.getController(req, res)
        .then(function (controller) {
            self.controller = controller;

            return self.parseRequest(req);
        })
        .then(function (data) {
            return self.controller.execute(req.method, data);
        })
        .catch(function (error) {
            console.log(error);
        });
};

/**
 * This function will parse the request and returns the fields and files send in the request.
 *
 * @method parseRequest
 * @param {Object} req NodeJS Request Object
 * @returns {Promise} Return the POST data and Files
 */
Dispatcher.prototype.parseRequest = function (req) {
    return new Promise(function (resolve, reject) {
        var form = new Formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            resolve({
                fields: fields,
                files: files
            });
        });
    });
};

/**
 * This function will return the Controller object for the request.
 *
 * @method getController
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 * @returns {Promise} Return the Controller object
 */
Dispatcher.prototype.getController = function (req, res) {
    var identifier = this.getIdentifier().clone();

    // This is a little more nice, i can now just use return, gone callback :D
    return this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(req.url.query.view)), {
        request: req,
        response: res
    });
};

module.exports = Dispatcher;