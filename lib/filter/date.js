"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

function DateFilter() {
    AbstractFilter.call(this);
}

util.inherits(DateFilter, AbstractFilter);

DateFilter.prototype.validate = function(value) {
    return (typeof value == 'string');
};

DateFilter.prototype.sanitize = function(value) {
    // Make an extra check.
    if(value instanceof Date) {
        return value.getMonth() + '-' + value.getDate() + '-' + value.getYear();
    }
};

module.exports = DateFilter;