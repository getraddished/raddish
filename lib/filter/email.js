'use strict';

var AbstractFilter  = require('./abstract');

/**
 * This class will check if a value is a valid email object. If not it must be sanitized.
 *
 * @class EmailFilter
 * @extends AbstractFilter
 */
class EmailFilter extends AbstractFilter {
    /**
     * This validate method will check if the value given is a valid email address.
     *
     * @method validate
     * @param {*} value The value to validate.
     * @return {boolean} True if the value is a correct email address, false otherwise.
     */
    validate(value) {
        value = value.toString();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    }

    /**
     * The sanitize method will strip any values not supported in an email address.
     *
     * @method sanitize
     * @param {*} value The value to sanitize.
     * @return {String} The sanitized email address.
     */
    sanitize(value) {
        value = value.toString();
        return value.replace(/[^a-zA-Z@0-9-_.]/g, '');
    }
}

module.exports = EmailFilter;