var Base = require('../base/base');
var util = require('util');
var Inflector = require('../inflector/inflector');

function ViewJson() {

};

util.inherits(ViewJson, Base);

ViewJson.prototype.initialize = function(config, callback) {
    var self = this;

    Base.prototype.initialize(config, function(done) {
        self.request = config.request;
        self.response = config.response;
        self.model = config.model;

        callback(true);
    });
};

ViewJson.prototype.display = function() {
    var self = this;

    if(Inflector.isPlural(this.request.url.query.view)) {
        return this.model.getList(function(err, rowset) {
            rowset.getData(function(data) {
                return self.response.end(JSON.stringify({
                    items: data,
                    states: self.model.states.get()
                }));
            });
        });
    } else {
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