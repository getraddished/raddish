var Abstract    = require('./abstract');
var util        = require('util');
var Filter      = require('./filter');

function SlugFilter() {
    Abstract.call(this);

    this.separator = '-';
}

util.inherits(SlugFilter, Abstract);

SlugFilter.prototype._validate = function(value) {
    var filter = Filter.getFilter('cmd');

    return filter.validate(value);
};

SlugFilter.prototype._sanitize = function(value) {
    var filter = Filter.getFilter('ascii');
    value = value.toString();

    value.replace(' ', this.separator);
    value = value.toLowerCase();
    value = value.trim();

    value = value.replace(/\s+/, this.separator);
    value = value.replace(/[^A-Za-z0-9\-]/, '');

    return value.replace(/[-]+/, this.separator);
};

module.exports = SlugFilter;