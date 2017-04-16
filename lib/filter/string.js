'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The StringFilter class will ensure that the value given is a string.
 *
 * @class StringFilter
 * @extends AbstractFilter
 */
class StringFilter extends AbstractFilter {
    /**
     * The validate method will check if the value given is a string or not.
     *
     * @method validate
     * @param {*} value The value to validate
     * @return {Boolean} True if the value is a string, false otherwise.
     */
    validate(value) {
        return (typeof value == 'string');
    }

    /**
     * The sanitize method will cast the value to a string.
     *
     * @method sanitize
     * @param {*} value The value to sanitize
     * @return {String} The sanitized string.
     */
    sanitize(value) {
        return value.toString();
    }
}

module.exports = StringFilter;