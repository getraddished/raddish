"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

function CmdFilter() {
    AbstractFilter.call(this);
}

util.inherits(CmdFilter, AbstractFilter);

CmdFilter.prototype._validate = function(value) {
    var regex = /^[A-Za-z0-9.\-_]*$/;

    if(typeof value === 'string' && regex.test(value)) {
        return true;
    }

    return false;
};

CmdFilter.prototype._sanitize = function(value) {
    var regex = /[^A-Za-z0-9.\-_]*/g;

    value = value.toString();
    value = value.trim();

    return value.replace(regex, '');
};

module.exports = CmdFilter;