var ViewJson    = require('./json'),
    Inflector   = require('../inflector/inflector'),
    util        = require('util');

/**
 * The ViewEmber object makes sure an EmberJS response object is returned.
 *
 * @class ViewEmber
 * @extends ViewJson
 * @param config
 * @constructor
 */
function ViewEmber(config) {
    ViewJson.call(this, config);
}

util.inherits(ViewEmber, ViewJson);

/**
 * The _viewSingle method presents a single EmberJS JSON Object together with the provided states.
 *
 * @method _viewSingle
 * @private
 * @param {Object} data The data to convert to a string.
 * @returns {Object} The JSON string containing a single object.
 */
ViewEmber.prototype._viewSingle = function(data) {
    var self = this;

    return Promise.resolve(data)
        .then(function(data) {
            var item = {};
            var name = data.getIdentifier().getPackage() + Inflector.capitalize(data.getIdentifier().getName());
            item[name] = data.getData();
            item.meta = {};

            var states = self.model.states.get();
            for (var state in states) {
                item.meta[state] = states[state].value;
            }

            return JSON.stringify(item);
        });
};

/**
 * The _viewSingle method presents a list of EmberJS JSON Object together with the provided states.
 *
 * @method _viewPlural
 * @private
 * @param {Object} data The data to convert to a string.
 * @returns {Object} The JSON string containing a list objects.
 */
ViewEmber.prototype._viewPlural = function(data) {
    var self = this;

    return Promise.resolve(data)
        .then(function(data) {
            return self.model.getTotal()
                .then(function(total) {
                    var items = {};
                    var name = data.getIdentifier().getPackage() + Inflector.capitalize(Inflector.pluralize(data.getIdentifier().getName()));
                    items[name] = data.getData();
                    items.meta = {};
                    items.meta.total = total;

                    var states = self.model.states.get();
                    for (var state in states) {
                        items.meta[state] = states[state].value;
                    }

                    return JSON.stringify(items);
                });
        });
};

module.exports = ViewEmber;
