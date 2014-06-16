var Abstract    = require('./abstract');
var util        = require('util');

function Md5Filter() {
    Abstract.call(this);
}

util.inherits(Md5Filter, Abstract);

Md5Filter.prototype._validate = function(value) {
    if(typeof value == 'string') {
        value = value.trim();
        var exp = new RegExp('^[a-f0-9]{32}$');

        return exp.test(value);

    } else {
        return false;
    }
};

Md5Filter.prototype._sanitize = function(value) {
    value = value.toString();
    value = value.trim();
    value = value.toLowerCase();

    return value.replace('/[^a-f0-9]*/', '').substr(0, 32);
};

module.exports = Md5Filter;