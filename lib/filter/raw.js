"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

/**
 * The RawFilter accepts any value and always returns true.
 * A RAW value just is the value and whatever the content might be, use with care.
 *
 * @class RawFilter
 * @constructor
 */
function RawFilter() {
    AbstractFilter.call(this);
}

util.inherits(RawFilter, AbstractFilter);

/**
 * A RAW value is always true.
 *
 * @method _validate
 * @private
 * @param {*} value The value to be validated
 * @returns {boolean} If the value is valid or not.
 */
RawFilter.prototype._validate = function() {
    return true;
};

/**
 * Return the RAW value.
 *
 * @method _sanitize
 * @private
 * @param {*} value The value to be sanitzed.
 * @returns {*} The RAW value
 */
RawFilter.prototype._sanitize = function(value) {
    return value;
};

module.exports = RawFilter;