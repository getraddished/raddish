var Abstract    = require('./abstract');
var util        = require('util');

function BooleanFilter() {
    Abstract.call(this);
};

util.inherits(BooleanFilter, Abstract);

BooleanFilter.prototype._validate = function(value) {
    return (value == true || value == false);
};

BooleanFilter.prototype._sanitize = function(value) {
    // Make an extra check.
    return (value > 1) ? true : false;
};

module.exports = BooleanFilter;