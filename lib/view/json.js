var Base = require('../base/base');
var util = require('util');
var Inflector = require('../inflector/inflector');

function ViewJson() {

};

util.inherits(ViewJson, Base);

ViewJson.prototype.initialize = function(config, callback) {
    var self = this;

    return new Promise(function(resolve, reject) {
        Base.prototype.initialize(config)
        .then(function(done) {
            self.request = config.request;
            self.response = config.response;
            self.model = config.model;

            resolve(self);
        });
    });
};

ViewJson.prototype.display = function() {
    var self = this;

    if(Inflector.isPlural(this.request.url.query.view)) {
        this.model.getList()
            .then(function(rowset) {
                return rowset.getData();
            })
            .then(function(data) {
                self.response.end(JSON.stringify({
                    items: data,
                    states: self.model.states.get()
                }));
            });
    } else {
        this.model.getItem()
            .then(function(row) {
                return row.getData();
            })
            .then(function(data) {
                self.response.end(JSON.stringify({
                    item: data,
                    states: self.model.states.get()
                }));
            });

        return this.model.getItem(function(err, row) {
            row.getData(function(data) {
                self.response.end(JSON.stringify({
                    item: data,
                    states: self.model.states.get()
                }));
            });
        });
    }
};

module.exports = ViewJson;