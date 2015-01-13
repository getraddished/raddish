var Abstract    = require('./abstract'),
    util        = require('util');

function IntFilter() {
    Abstract.call(this);
};

util.inherits(IntFilter, Abstract);

IntFilter.prototype._validate = function(value) {
    return (typeof value == 'number') ? true : false;
};

IntFilter.prototype._sanitize = function(value) {
    return parseInt(value);
};

module.exports = IntFilter;