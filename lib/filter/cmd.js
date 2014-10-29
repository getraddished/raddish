var Abstract    = require('./abstract');
var util        = require('util');

function CmdFilter() {
    Abstract.call(this);
}

util.inherits(CmdFilter, Abstract);

CmdFilter.prototype._validate = function(value) {
    var regex = /^[A-Za-z0-9.\-_]*$/;

    if(typeof value === 'string' && regex.test(value)) {
        return true;
    }

    return false;
};

CmdFilter.prototype._sanitize = function(value) {
    var regex = /[^A-Za-z0-9.\-_]*/;

    value = value.toString();
    value = value.trim();

    return value.replace(regex, '');
};