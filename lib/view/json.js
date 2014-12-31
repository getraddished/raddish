"use strict";

var ViewAbstract    = require('./abstract'),
    util            = require('util'),
    Inflector       = require('../inflector/inflector'),
    through2        = require('through2');

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
        return this.data.pipe(through2.obj(function(chunk, enc, callback) {
            if(Inflector.isPlural(self.request.view)) {
                return callback(null, JSON.stringify({items: chunk.getData()}));
            }

            return callback(null, JSON.stringify({item: chunk.getData()}));
        }, function(callback) {
            var transform = this;
            var states = {
                states: self.model.states.get()
            };

            if (Inflector.isPlural(self.request.view)) {
                self.model.getTotal()
                    .then(function(total) {
                        states['total'] = total;

                        transform.push(JSON.stringify(states));
                        callback(null);
                    });
            } else {
                this.push(JSON.stringify(states));
                return callback(null);
            }
        }));
    }

    if (Inflector.isPlural(self.request.view)) {
        return this._viewPlural(self.data.getData());
    } else {
        return this._viewSingle(self.data.getData());
    }
};

ViewJson.prototype._viewSingle = function(data) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            return JSON.stringify({
                item: data,
                states: self.model.states.get()
            });
        });
};

ViewJson.prototype._viewPlural = function(data) {
    var self = this;

    return Promise.cast(data)
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
};

module.exports = ViewJson;