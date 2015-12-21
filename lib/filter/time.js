"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

function TimeFilter() {
    AbstractFilter.call(this);
}

util.inherits(TimeFilter, AbstractFilter);

TimeFilter.prototype._validate = function(value) {
    return (typeof value == 'string');
};

TimeFilter.prototype._sanitize = function(value) {
    // Make an extra check.
    if(value instanceof Date) {
        return value.toISOString();
    }
};

module.exports = TimeFilter;