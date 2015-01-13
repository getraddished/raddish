var Abstract    = require('./abstract'),
    util        = require('util');

function TimeFilter() {
    Abstract.call(this);
};

util.inherits(TimeFilter, Abstract);

TimeFilter.prototype._validate = function(value) {
    return (typeof value == 'string');
};

TimeFilter.prototype._sanitize = function(value) {
    // Make an extra check.
    if(value instanceof Date) {
        return value.toISOString();
    }
};

module.exports = TimeFilter;