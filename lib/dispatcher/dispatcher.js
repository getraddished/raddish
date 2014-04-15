var Base        = require('../base/base');
var util        = require('util');
var Inflector   = require('../inflector/inflector');
var Formidable  = require('formidable');
var password    = require('passport');

/**
 * Dispatcher class which will dispatch the request to the appropriate controller.
 *
 * @class Dispatcher
 * @constructor
 */
function Dispatcher() {
    this.controller = undefined;

    Dispatcher.super_.apply(this, arguments);
}

util.inherits(Dispatcher, Base);

Dispatcher.prototype.initialize = function(config) {
    if(config.controller) {
        this.controller = config.controller;
    }

    return Dispatcher.super_.prototype.initialize.call(this, config);
}

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

    // Here I will add a basic user authentication,
    // It can be overwritten in the default dispatcher
    var promise = this.authenticate(req)
        .then(function(authenticated) {
            return [self.getController(req, res), authenticated];
        })
        .spread(function (controller, authenticated) {
            self.controller = controller;
            return [self.parseRequest(req), authenticated];
        })
        .spread(function (data, authenticated) {
            data.auth = authenticated;
            data.request = req;
            data.response = res;

            return self.controller.execute(req.method, data);
        })
        .then(function(data) {
            res.statusCode = 200;
            res.end(data);
        })
        .catch(function (error) {
            self.handleException(res, error);
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
    return this.getObject(identifier.setPath(['controller']).setName(Inflector.singularize(this.controller || req.url.query.view)), {
        request: req,
        response: res
    });
};

/**
 * This is a simple auth login function, if you want to extend it/ override it you can do it in the default dispatcher
 *
 * @param {Request} request NodeJS Request object
 */
Dispatcher.prototype.authenticate = function(request) {
    return new Promise(function(resolve, reject) {
        var header = request.headers['authorization'] || '';
        var token = header.split(/\s+/).pop() || '';
        var auth = new Buffer(token, 'base64').toString();
        var parts = auth.split(/:/);
        var username = parts[0];
        var password = parts[1];

        if(username && password) {
            resolve({
                username: username,
                password: password
            });
        } else {
            resolve({});
        }
    });
};

Dispatcher.prototype.handleException = function(response, error) {
    if(error instanceof RaddishError) {
        response.statusCode = error.code;
        response.end(JSON.stringify(error));
    } else {
        // Return the default error value.
        console.log(error.stack);
        process.exit(1);
    }
};

module.exports = Dispatcher;