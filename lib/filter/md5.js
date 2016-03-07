"use strict";

var AbstractFilter  = require('./abstract'),
    util            = require('util');

/**
 * The MD5Filter is validate and/or sanatize a MD5 hash.
 *
 * @class Md5Filter
 * @constructor
 */
function Md5Filter() {
    AbstractFilter.call(this);
}

util.inherits(Md5Filter, AbstractFilter);

/**
 * The validate method will check if the md5 hash is valid or not.
 *
 * @method validate
 * @private
 * @param {*} value The value to validate.
 * @returns {Boolean} If the value is valid or not.
 */
Md5Filter.prototype.validate = function(value) {
    if(typeof value == 'string') {
        value = value.trim();
        var exp = /^[a-f0-9]{32}$/;

        return exp.test(value);

    } else {
        return false;
    }
};

/**
 * This method will sanitize the MD5 hash.
 *
 * @method sanitize
 * @private
 * @param {*} The value to be sanitized.
 * @returns {String} The validated md5 hash.
 */
Md5Filter.prototype.sanitize = function(value) {
    value = value.toString();
    value = value.trim();
    value = value.toLowerCase();

    return value.replace('/[^a-f0-9]*/', '').substr(0, 32);
};

module.exports = Md5Filter;