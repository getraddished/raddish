"use strict";

var Service = require('../service/service');
var util    = require('util');
var zlib    = require('zlib');

/**
 * The ViewAbstract object can be used as template for any extra formats.
 * @constructor
 */
function ViewAbstract() {

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

    this.request = config.request;
    this.response = config.response;
    this.response.setHeader('Content-Type', config.mimetype);

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

    return new Promise(function(resolve, reject) {
        if(self.request.headers['accept-encoding'] && self.request.headers['accept-encoding'].match(/\bgzip\b/) && self.getConfig('gzip')) {
            zlib.gzip(data, function(err, compressed) {
                self.response.writeHead(200, { 'content-encoding': 'gzip' });
                resolve(compressed);
            });
        } else {
            resolve(data);
        }
    });
};

module.exports = ViewAbstract;