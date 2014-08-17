"use strict";

var Abstract    = require('./abstract');
var util        = require('util');

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

module.exports = HttpDispatcher;