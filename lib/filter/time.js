'use strict';

var AbstractFilter  = require('./abstract');

class TimeFilter extends AbstractFilter {
    validate(value) {
        return (typeof value == 'string');
    }

    sanitize(value) {
        if(value instanceof Date) {
            return value.toISOString();
        }
    }
}

module.exports = TimeFilter;