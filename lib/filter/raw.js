var Abstract    = require('./abstract');
var util        = require('util');

function RawFilter() {
    Abstract.call(this);
}

util.inherits(RawFilter, Abstract);

RawFilter.prototype._validate = function(value) {
    return true;
};

RawFilter.prototype._sanitize = function(value) {
    return value;
};

module.exports = RawFilter;