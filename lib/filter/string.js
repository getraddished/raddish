'use strict';

var AbstractFilter  = require('./abstract');

class StringFilter extends AbstractFilter {
    validate(value) {
        return (typeof value == 'string');
    }

    sanitize(value) {
        return value.toString();
    }
}

module.exports = StringFilter;