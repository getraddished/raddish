var ViewAbstract    = require('./abstract');
var util            = require('util');
var Inflector       = require('../inflector/inflector');

function ViewJson() {
    ViewJson.super_.apply(this, arguments);
};

util.inherits(ViewJson, ViewAbstract);

ViewJson.prototype.initialize = function (config, callback) {
    var self = this;
    config.mimetype = 'application/json';
    this.model = config.model;

    return ViewJson.super_.prototype.initialize.call(self, config);
};

ViewJson.prototype.display = function () {
    var self = this;

    return new Promise(function(resolve, reject) {
        if (Inflector.isPlural(self.request.url.query.view)) {
            self.data.data.getData()
                .then(function(data) {
                    return Promise.resolve(JSON.stringify({
                        items: data,
                        states: self.data.states
                    }));
                })
                .then(function(data) {
                    return self.GZip(data);
                })
                .then(function(data) {
                    resolve(data);
                });
        } else {
            self.data.data.getData()
                .then(function(data) {
                    return Promise.resolve(JSON.stringify({
                        item: data,
                        states: self.data.states
                    }));
                })
                .then(function(data) {
                    return self.GZip(data);
                })
                .then(function(data) {
                    resolve(data);
                });
        }
    });
};

module.exports = ViewJson;