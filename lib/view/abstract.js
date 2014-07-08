"use strict";

var Service = require('../service/service');
var util    = require('util');
var zlib    = Promise.promisifyAll(require('zlib'));

/**
 * The ViewAbstract object can be used as template for any extra formats.
 * @constructor
 */
function ViewAbstract(config) {
    ViewAbstract.super_.call(this, config);
}

util.inherits(ViewAbstract, Service);

/**
 * The initialize function will set the mimetype which is set in the override.
 * along with other information.
 *
 * @method initialize
 * @param {Object} config The config object for the layout
 * @returns {*|Promise}
 */
ViewAbstract.prototype.initialize = function(config) {
    var self = this;

    this.model = config.model;
    this.mimetype = config.mimetype;
    this.request = {};
    this.response = {};

    return ViewAbstract.super_.prototype.initialize.call(self, config);
};

/**
 * This function will set the data to the Object.
 *
 * @method setData
 * @param data
 */
ViewAbstract.prototype.setData = function(data) {
    this.data = data;
};

/**
 * This function will check if gzip is enabled and supported, if both are correct it will gzip the date and send it to the response.
 *
 * @method GZip
 * @param {Object} data The data object which needs GZipping.
 * @returns {Promise}
 * @constructor
 */
ViewAbstract.prototype.GZip = function(data) {
    var self = this;

    if(self.request.headers['accept-encoding'] && self.request.headers['accept-encoding'].match(/\bgzip\b/) && self.getConfig('gzip')) {
        return zlib.gzipAsync(data)
            .then(function(data) {
                self.response.writeHead(200, { 'content-encoding': 'gzip' });
                return data;
            });
    } else {
        return Promise.resolve(data);
    }
};

module.exports = ViewAbstract;