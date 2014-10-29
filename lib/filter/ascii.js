var Abstract    = require('./abstract');
var util        = require('util');

function AsciiFilter() {
    Abstract.call(this);
}

util.inherits(AsciiFilter, Abstract);

AsciiFilter.prototype._validate = function(value) {
    var regex = /(?:[^\x00-\x7F])/;

    return ((regex.test(value)) !== 1);
};

AsciiFilter.prototype._sanitize = function(value) {
    value = value.toString();

    value = value.replace(/&szlig;/, 'ss');
    value = value.replace(/&(..)lig;/, '$1');
    value = value.replace(/&([aouAOU])uml;/, '$1' + 'e');

    return value.replace(/&(.)[^;]*;/, '$1');
};

module.exports = AsciiFilter;