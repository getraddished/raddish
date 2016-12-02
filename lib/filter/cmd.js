'use strict';

var AbstractFilter  = require('./abstract');

class CmdFilter extends AbstractFilter {
    validate(value) {
        var regex = /^[A-Za-z0-9.\-_]*$/;

        if(typeof value === 'string' && regex.test(value)) {
            return true;
        }

        return false;
    }

    sanitize(value) {
        var regex = /[^A-Za-z0-9.\-_]*/g;

        value = value.toString();
        value = value.trim();

        return value.replace(regex, '');
    }
}

module.exports = CmdFilter;