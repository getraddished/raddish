"use strict";

var Service     = require('../service/service');
var util        = require('util');
var Inflector   = require('../inflector/inflector');
var Formidable  = require('formidable');

/**
 * Dispatcher class which will dispatch the request to the appropriate controller.
 *
 * @class Dispatcher
 * @constructor
 */
function Dispatcher(config) {
    this.controller = undefined;

    Dispatcher.super_.call(this, config);
}

util.inherits(Dispatcher, Service);

Dispatcher.prototype.initialize = function(config) {
    if(config.controller) {
        this.controller = config.controller;
    }

    return Dispatcher.super_.prototype.initialize.call(this, config);
};

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
    this.authenticate(req)
        .then(function(authenticated) {
            // Self.controller is now a promise because we want to load it in the background. Async for the win!
            self.getController(req, res);

            return authenticated;
        })
        .then(function (authenticated) {
            return [self.parseRequest(req), authenticated];
        })
        .spread(function (data, authenticated) {
            data.auth = authenticated;
            data.request = req;
            data.response = res;

            return self.controller.then(function(controller) {
                return controller.execute(req.method, data)
            });
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
    var self = this;

    // This is a little more nice, i can now just use return, gone callback :D
    this.controller = this.getService(identifier.setPath(['controller']).setName(Inflector.singularize(this.controller || req.url.query.view)), {
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

/**
 * This function will handle the exceptions thrown in the framework,
 * if it is an instance of RaddishError it will return it to the browser.
 *
 * @method handleException
 * @param {Object} response NodeJS request object.
 * @param {Object} error The error object.
 */
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