"use strict";

var Abstract    = require('./abstract'),
    util        = require('util');

/**
 * Dispatcher class which will dispatch the http request to the appropriate controller.
 *
 * @class Dispatcher
 * @extends AbstractDispatcher
 * @constructor
 */
function HttpDispatcher(config) {
    Abstract.call(this, config);
}

util.inherits(HttpDispatcher, Abstract);

/**
 * This is an override of the dispatch method,
 * This will handle the output to the client.
 *
 * @param {Object} req The NodeJS request object
 * @param {Object} res The NodeJS response object
 */
HttpDispatcher.prototype.dispatch = function(req, res) {
    var self = this;

    Abstract.prototype.dispatch.call(this, req, res)
        .then(function (data) {
            res.setHeader('Content-Type', data.result.mimetype);
            res.statusCode = data.status;

            return data.result.display();

        })
        .then(function (data) {
            return self.GZip(req, res, data);
        })
        .then(function (data) {
            res.end(data);
        })
        .catch(function (error) {
            self.handleException(res, error);
        });
};

module.exports = HttpDispatcher;