'use strict';

var AbstractFilter  = require('./abstract');

class EmailFilter extends AbstractFilter {
    validate(value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    }

    sanitize(value) {
        var exp = /[^a-zA-Z@0-9-_.]/g;
        return value.replace(exp, '');
    }
}

module.exports = EmailFilter;