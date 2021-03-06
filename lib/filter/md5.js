'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The MD5Filter is validate and/or sanatize a MD5 hash.
 *
 * @class Md5Filter
 * @extends AbstractFilter
 */
class Md5Filter extends AbstractFilter {
    /**
     * The validate method will check if the md5 hash is valid or not.
     *
     * @method validate
     * @param {*} value The value to validate.
     * @returns {Boolean} If the value is valid or not.
     */
    validate(value) {
        if(typeof value == 'string') {
            value = value.trim();
            var exp = /^[a-f0-9]{32}$/;

            return exp.test(value);

        } else {
            return false;
        }
    }

    /**
     * This method will sanitize the MD5 hash.
     *
     * @method sanitize
     * @param {*} value The value to be sanitized.
     * @returns {String} The validated md5 hash.
     */
    sanitize(value) {
        value = value.toString();
        value = value.trim();
        value = value.toLowerCase();

        return value.replace('/[^A-Fa-f0-9]*/', '').substr(0, 32);
    }
}

module.exports = Md5Filter;