"use strict";

var ObjectManager   = require('../object/manager'),
    util            = require('util');

/**
 * The AbstractView object can be used as template for any extra formats.
 *
 * @class AbstractView
 * @extends ObjectManager
 * @constructor
 */
function AbstractView(config) {
    this.headers = {};
    this.model = {};

    ObjectManager.call(this, config);
}

util.inherits(AbstractView, ObjectManager);

/**
 * The initialize method will set the mimetype which is set in the override.
 * along with other information.
 *
 * @method initialize
 * @param {Object} config The config object for the layout
 * @returns {Promise} The promise containing the view
 */
AbstractView.prototype.initialize = function(config) {
    var self = this;

    this.model = config.model;
    this.headers['Content-Type'] = config.mimetype;

    if(config.headers) {
        for(var index in config.headers) {
            this.headers[index] = config.headers[index];
        }
    }

    return ObjectManager.prototype.initialize.call(self, config);
};

/**
 * This method will set the data to the Object.
 *
 * @method setData
 * @param {Object} data The data for the view object
 */
AbstractView.prototype.setData = function(data) {
    this.data = data;
};

module.exports = AbstractView;