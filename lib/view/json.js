"use strict";

var ViewAbstract    = require('./abstract');
var util            = require('util');
var Inflector       = require('../inflector/inflector');

function ViewJson(config) {
    ViewJson.super_.call(this, config);
};

util.inherits(ViewJson, ViewAbstract);

/**
 * This function will receive a model object and will set it locally.
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
 * This is the overridden display function which will format our data and return it to the controller when done.
 *
 * @method display
 * @returns {*}
 */
ViewJson.prototype.display = function () {
    var self = this;

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

module.exports = ViewJson;