"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

/**
 * The ASCII filter to check the value for ASCII characters.
 *
 * @class AsciiFilter
 * @constructor
 */
function AsciiFilter() {
    AbstractFilter.call(this);
}

util.inherits(AsciiFilter, AbstractFilter);

/**
 * The validate method checks if there are unaccepted characters in the value.
 * If so it resturns a false.
 *
 * @method _validate
 * @private
 * @param {*} value The value to validate.
 * @returns {Boolean} If there are ASCII characters in the value it will return false.
 */
AsciiFilter.prototype._validate = function(value) {
    var regex = /(?:[^\x00-\x7F])/;

    return !(regex.test(value));
};

/**
 * The sanitize method will change the ASCII values to html accepted characters.
 *
 * @param {String} value The value to sanitize.
 * @returns {String} The sanitized value.
 * @private
 */
AsciiFilter.prototype._sanitize = function(value) {
    value = value.toString();

    value = value.replace(/szlig;/, 'ss');
    value = value.replace(/(..)lig;/, '$1');
    value = value.replace(/([aouAOU])uml;/, '$1' + 'e');

    return value.replace(/&(.)[^;]*;/, '$1');
};

module.exports = AsciiFilter;