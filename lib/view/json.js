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
            self.response.end(JSON.stringify({
                items: rowset,
                states: self.model.states.get()
            }));
        });
    } else {
        return this.model.getItem(function(err, row) {
            self.response.end(JSON.stringify({
                item: row[0],
                states: self.model.states.get()
            }));
        });
    }
};

module.exports = ViewJson;