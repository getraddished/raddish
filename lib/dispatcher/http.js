"use strict";

var Abstract    = require('./abstract');
var util        = require('util');
var Formidable  = require('formidable');

/**
 * Dispatcher class which will dispatch the request to the appropriate controller.
 *
 * @class Dispatcher
 * @constructor
 */
function HttpDispatcher(config) {
    this.controller = undefined;

    Abstract.call(this, config);
}

util.inherits(HttpDispatcher, Abstract);

/**
 * This function will dispatch the request to the correct controller
 *
 * @method dispatch
 * @param {Object} req NodeJS Request Object
 * @param {Object} res NodeJS Response Object
 */
HttpDispatcher.prototype.dispatch = function (req, res) {
    // Here the real-world test will commence
    var self = this;

    // Here I will add a basic user authentication,
    // It can be overwritten in the default dispatcher
    this.getAuthenticator()
        .then(function(authenticator) {
            return authenticator.authenticate(req);
        })
        .then(function(authenticated) {
            // Self.controller is now a promise because we want to load it in the background. Async for the win!
            self.getController(req);

            return authenticated;
        })
        .then(function (authenticated) {
            return [self.controller, self.parseRequest(req), authenticated];
        })
        .spread(function (controller, data, authenticated) {
            var context         = controller.getContext();
            context.auth        = authenticated;
            context.request     = controller.getRequest();
            context.data        = data;

            return controller.execute(req.method, context);
        })
        // TODO: Add a gip check in here.
        .then(function(data) {
            res.setHeader('Content-Type', data.result.mimetype);
            res.statusCode = data.status;

            return data.result.display();

        })
        .then(function(data) {
            return self.GZip(req, res, data);
        })
        .then(function(data) {
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
HttpDispatcher.prototype.parseRequest = function (req) {
    var form = Promise.promisifyAll(new Formidable.IncomingForm());

    return form.parseAsync(req)
        .spread(function (fields, files) {
            return {
                fields: fields,
                files: files
            };
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
HttpDispatcher.prototype.handleException = function(response, error) {
    if(error instanceof RaddishError) {
        response.statusCode = error.code;
        response.end(JSON.stringify(error));
    } else {
        // Return the default error value.
        console.log(error.stack);
        process.exit(1);
    }
};

module.exports = HttpDispatcher;