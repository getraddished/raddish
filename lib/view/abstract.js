"use strict";

var ObjectManager   = require('../object/manager');
var util            = require('util');

/**
 * The ViewAbstract object can be used as template for any extra formats.
 *
 * @class ViewAbstract
 * @extends ObjectManager
 * @constructor
 */
function ViewAbstract(config) {
    ObjectManager.call(this, config);
}

util.inherits(ViewAbstract, ObjectManager);

/**
 * The initialize method will set the mimetype which is set in the override.
 * along with other information.
 *
 * @method initialize
 * @param {Object} config The config object for the layout
 * @returns {Promise} The promise containing the view
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
 * This method will set the data to the Object.
 *
 * @method setData
 * @param {Object} data The data for the view object
 */
ViewAbstract.prototype.setData = function(data) {
    this.data = data;
};

module.exports = ViewAbstract;