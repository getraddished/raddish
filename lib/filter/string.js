var Abstract    = require('./abstract'),
    util        = require('util');

function StringFilter() {
    Abstract.call(this);
}

util.inherits(StringFilter, Abstract);

StringFilter.prototype._validate = function(value) {
    return (typeof value == 'string') ? true : false;
};

StringFilter.prototype._sanitize = function(value) {
    return value.toString();
};

module.exports = StringFilter;