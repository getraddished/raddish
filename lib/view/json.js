"use strict";

var ViewAbstract    = require('./abstract');
var util            = require('util');
var Inflector       = require('../inflector/inflector');

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
    this._type = 'transform';

    ViewJson.super_.call(this, config);
};

util.inherits(ViewJson, ViewAbstract);

/**
 * This method will receive a model object and will set it locally.
 * Also it will set the mimetype of the response.
 *
 * @method initialize
 * @param {Object} config The config object of the object
 * @returns {*|Promise}
 */
ViewJson.prototype.initialize = function (config) {
    config.mimetype = 'application/json';

    return ViewJson.super_.prototype.initialize.call(this, config);
};

/**
 * This is the overridden display method which will format our data and return it to the controller when done.
 *
 * @method display
 * @returns {Promise} The promise containing the json as a string.
 */
ViewJson.prototype.display = function () {
    var self = this;

    if(Raddish.getConfig('stream')) {
        return this.data.pipe(this);
    }

    if (Inflector.isPlural(self.request.view)) {
        return Promise.cast(self.data.getData())
            .then(function(data) {
                return [data, self.model.getTotal()];
            })
            .spread(function(data, total) {
                return JSON.stringify({
                    items: data,
                    total: total,
                    states: self.model.states.get()
                });
            });
    } else {
        return Promise.cast(self.data.getData())
            .then(function(data) {
                return JSON.stringify({
                    item: data,
                    states: self.model.states.get()
                });
            });
    }
};

ViewJson.prototype._transform = function(chunk, encoding, callback) {
    console.log(chunk);
};

module.exports = ViewJson;