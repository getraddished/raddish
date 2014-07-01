var Abstract    = require('./abstract');
var util        = require('util');

function DateFilter() {
    Abstract.call(this);
};

util.inherits(DateFilter, Abstract);

DateFilter.prototype._validate = function(value) {
    return (typeof value == 'string');
};

DateFilter.prototype._sanitize = function(value) {
    // Make an extra check.
    if(value instanceof Date) {
        return value.getMonth() + '-' + value.getDate() + '-' + value.getYear();
    }
};

module.exports = DateFilter;