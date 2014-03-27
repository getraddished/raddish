var Base = require('../base/base');
var util = require('util');
var Inflector = require('../inflector/inflector');

function ViewJson() {

};

util.inherits(ViewJson, Base);

ViewJson.prototype.initialize = function (config, callback) {
    var self = this;

    return new Promise(function (resolve, reject) {
        Base.prototype.initialize(config)
            .then(function (done) {
                self.request = config.request;
                self.response = config.response;
                self.model = config.model;

                resolve(self);
            });
    });
};

ViewJson.prototype.setData = function(data) {
    this.data = data;
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