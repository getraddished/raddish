"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

function StringFilter() {
    AbstractFilter.call(this);
}

util.inherits(StringFilter, AbstractFilter);

StringFilter.prototype.validate = function(value) {
    return (typeof value == 'string') ? true : false;
};

StringFilter.prototype.sanitize = function(value) {
    return value.toString();
};

module.exports = StringFilter;