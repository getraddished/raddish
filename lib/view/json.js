"use strict";

var AbstractView    = require('./abstract'),
    util            = require('util'),
    Inflector       = require('../inflector/inflector');

/**
 * This is the main view object.
 * Which is also used by default.
 *
 * @class ViewJson
 * @extends ViewAbstract
 * @param {Object} config The config object
 * @constructor
 */
function ViewJson(config) {
    AbstractView.call(this, config);
}

util.inherits(ViewJson, AbstractView);

/**
 * This method will receive a model object and will set it locally.
 * Also it will set the mimetype of the response.
 *
 * @method initialize
 * @param {Object} config The config object of the object
 * @returns {Promise} The initialized object.
 */
ViewJson.prototype.initialize = function (config) {
    config.mimetype = 'application/json';

    return ViewAbstract.prototype.initialize.call(this, config);
};

/**
 * This is the overridden display method which will format our data and return it to the controller when done.
 *
 * @method display
 * @returns {Promise} The promise containing the json as a string.
 */
ViewJson.prototype.display = function () {
    var self = this;

    if (Inflector.isPlural(self.request.view)) {
        return this._viewPlural(self.data);
    }

    return this._viewSingle(self.data);
};

/**
 * The _viewSingle method will display a single object together with the provided states.
 *
 * @method _viewSingle
 * @private
 * @param {Object} data The data to convert to a string.
 * @returns {Object} The JSON string containing a single object.
 */
ViewJson.prototype._viewSingle = function(data) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            return JSON.stringify({
                item: data.getData(),
                states: self.model.states.get()
            });
        });
};

/**
 * The _viewPlural method will display a list of objects together with the provided states.
 *
 * @method _viewPlural
 * @private
 * @param {Object} data The data to convert to a string.
 * @returns {Object} The JSON string containing a list of objects.
 */
ViewJson.prototype._viewPlural = function(data) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            return [data, self.model.getTotal()];
        })
        .spread(function(data, total) {
            return JSON.stringify({
                items: data.getData(),
                total: total,
                states: self.model.states.get()
            });
        });
};

module.exports = ViewJson;