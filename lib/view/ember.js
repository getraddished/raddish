var JsonView    = require('./json'),
    Inflector   = require('../inflector/inflector'),
    util        = require('util');

function ViewEmber(config) {
    JsonView.call(this, config);
}

util.inherits(ViewEmber, JsonView);

ViewEmber.prototype._viewSingle = function(data, meta) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            var item = {};
            var name = data.getIdentifier().getPackage() + Inflector.capitalize(data.getIdentifier().getName());
            item[name] = data.getData();

            if(meta) {
                item.meta = {};

                var states = self.model.states.get();
                for (var state in states) {
                    item.meta[state] = states[state].value;
                }
            }

            return JSON.stringify(item);
        });
};

ViewEmber.prototype._viewPlural = function(data, meta) {
    var self = this;

    return Promise.cast(data)
        .then(function(data) {
            return [data, self.model.getTotal()];
        })
        .spread(function(data, total) {
            var items = {};
            var name = data.getIdentifier().getPackage() + Inflector.capitalize(Inflector.pluralize(data.getIdentifier().getName()));
            items[name] = data.getData();

            if(meta) {
                items.meta = {};
                items.meta.total = total;

                var states = self.model.states.get();
                for (var state in states) {
                    items.meta[state] = states[state].value;
                }
            }

            return JSON.stringify(items);
        });
};

module.exports = ViewEmber;