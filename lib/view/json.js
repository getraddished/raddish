var ViewAbstract    = require('./abstract');
var util            = require('util');
var Inflector       = require('../inflector/inflector');

function ViewJson() {
    ViewJson.super_.apply(this, arguments);
};

util.inherits(ViewJson, ViewAbstract);

ViewJson.prototype.initialize = function (config, callback) {
    var self = this;

    return new Promise(function (resolve, reject) {
        ViewJson.super_.prototype.initialize.call(self, config)
            .then(function (done) {
                self.request = config.request;
                self.response = config.response;
                self.model = config.model;

                resolve(self);
            });
    });
};

ViewJson.prototype.display = function () {
    var self = this;
    
    return new Promise(function(resolve, reject) {
        if (Inflector.isPlural(self.request.url.query.view)) {
            self.data.data.getData()
                .then(function(data) {
                    resolve(JSON.stringify({
                        items: data,
                        states: self.data.states
                    }));
                });
        } else {
            self.data.data.getData()
                .then(function(data) {
                    resolve(JSON.stringify({
                        item: data,
                        states: self.data.states
                    }));
                });
        }
    });
};

module.exports = ViewJson;