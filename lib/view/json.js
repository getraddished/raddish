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
                return self._viewPlural(chunk)
                    .then(function(data) {
                        return callback(null, data);
                    })
            }

            return self._viewSingle(chunk)
                .then(function(data) {
                    return callback(null, data);
                });
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
        return this._viewPlural(self.data, true);
    } else {
        return this._viewSingle(self.data, true);
    }
};

ViewJson.prototype._viewSingle = function(data, states) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            var item = {
                item: data.getData()
            };

            if(states) {
                item.states = self.model.states.get();
            }

            return JSON.stringify(item);
        });
};

ViewJson.prototype._viewPlural = function(data, states) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            return [data, self.model.getTotal()];
        })
        .spread(function(data, total) {
            var items = {
                items: data.getData()
            }

            if(states) {
                items.total = total;
                items.states = self.model.states.get();
            }

            return JSON.stringify(items);
        });
};

module.exports = ViewJson;