var Abstract    = require('./abstract'),
    util        = require('util');

function EmailFilter() {
    Abstract.call(this);
}

util.inherits(EmailFilter, Abstract);

EmailFilter.prototype._validate = function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

EmailFilter.prototype._sanitize = function(value) {
    var exp = /[^a-zA-Z@0-9-_.]/g;
    return value.replace(exp, '')
};

module.exports = EmailFilter;