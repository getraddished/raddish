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
                resolve(JSON.stringify({
                    items: self.data.items,
                    states: self.data.states
                }));
        } else {
            this.model.getItem()
                .then(function (row) {
                    return row.getData();
                })
                .then(function (data) {
                    self.response.end(JSON.stringify({
                        item: data,
                        states: self.model.states.get()
                    }));
                });

            return self.model.getItem(function(err, row) {
                row.getData(function (data) {
                    self.response.end(JSON.stringify({
                        item: data,
                        states: self.model.states.get()
                    }));
                });
            });
        }
    });
};

module.exports = ViewJson;