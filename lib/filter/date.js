'use strict';

var AbstractFilter  = require('./abstract');

class DateFilter extends AbstractFilter {
    validate(value) {
        return (value instanceof Date);
    }

    sanitize(value) {
        if(value instanceof Date) {
            return value;
        }

        value = value.toString();
        return new Date(value);
    }
}

module.exports = DateFilter;