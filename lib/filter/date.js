'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The DateFilter will check if a value is a date or not.
 * Also when sanitizing the value is converted to a date form.
 *
 * @class DateFilter
 * @extends AbstractFilter
 */
class DateFilter extends AbstractFilter {
    /**
     * This method will check if the value is a date object.
     *
     * @method validate
     * @param {*} value The value to check.
     * @return {boolean} True when a value is a date object otherwise false.
     */
    validate(value) {
        return (value instanceof Date);
    }

    /**
     * The sanitize method will sanitize the value to a date object.
     *
     * @method sanitize
     * @param {*} value The value to sanitize.
     * @return {Date} The sanitized date object.
     */
    sanitize(value) {
        value = value.toString();
        return new Date(value);
    }
}

module.exports = DateFilter;