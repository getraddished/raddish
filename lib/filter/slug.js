var AbstractFilter  = require('./abstract'),
    util            = require('util'),
    Filter          = require('./filter');

function SlugFilter() {
    AbstractFilter.call(this);

    this.separator = '-';
}

util.inherits(SlugFilter, AbstractFilter);

SlugFilter.prototype._validate = function(value) {
    var filter = Filter.getFilter('cmd');

    return filter.validate(value);
};

SlugFilter.prototype._sanitize = function(value) {
    value = value.toString();

    value.replace(' ', this.separator);
    value = value.toLowerCase();
    value = value.trim();

    value = value.replace(/\s+/g, this.separator);
    value = value.replace(/[^A-Za-z0-9\-]/g, '');

    return value.replace(/[-]+/g, this.separator);
};

module.exports = SlugFilter;