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

HttpDispatcher.prototype.dispatch = function(req, res) {
    var self = this;
    
    return Abstract.prototype.dispatch.call(this, req, res)
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
        response.end(JSON.stringify({
            'code': error.code,
            'message': error.message,
            'stack': error.stack
        }));
    } else {
        // Return the default error value.
        console.log(error.stack);
        process.exit(1);
    }
};

module.exports = HttpDispatcher;