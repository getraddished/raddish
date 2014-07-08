"use strict";

var Service = require('../service/service');
var util    = require('util');

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

module.exports = ViewAbstract;