"use strict";

var AbstractDispatcher  = require('./abstract'),
    util                = require('util');

/**
 * Dispatcher class which will dispatch the http request to the appropriate controller.
 *
 * @class Dispatcher
 * @extends AbstractDispatcher
 * @constructor
 */
function HttpDispatcher(config) {
    AbstractDispatcher.call(this, config);
}

util.inherits(HttpDispatcher, AbstractDispatcher);

/**
 * This is an override of the dispatch method,
 * This will handle the output to the client.
 *
 * @param {Object} req The NodeJS request object
 * @param {Object} res The NodeJS response object
 */
HttpDispatcher.prototype.dispatch = function(req, res) {
    var self = this;

    AbstractDispatcher.prototype.dispatch.call(this, req, res)
        .then(function (data) {
            var value = data.result.display();

            if(Object.keys(data.result.headers).length > 0) {
                for(var index in data.result.headers) {
                    res.setHeader(index, data.result.headers[index]);
                }
            }

            res.statusCode = data.status;
            return value;
        })
        .then(function (data) {
            return self.GZip(req, res, data);
        })
        .then(function (data) {
            data.pipe(res);
        })
        .catch(function (error) {
            if((error instanceof RaddishError) === false) {
                error = new RaddishError(500, error.message);
            }

            self.handleException(res, error);
        });
};

module.exports = HttpDispatcher;