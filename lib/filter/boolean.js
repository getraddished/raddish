'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The BooleanFilter will check for booleans.
 *
 * @class BooleanFilter
 * @constructor
 */
class BooleanFilter extends AbstractFilter {
    /**
     * The validate method checks if the values is a true or false.
     *
     * @method validate
     * @private
     * @param {*} value The value to evaluate.
     * @returns {boolean} The the value is a boolean true will be returned.
     */
    validate(value) {
        return (value == true || value == false);
    }

    /**
     * The sanitize method will check if the value given is bigger than 0,
     * if so a true will be returned
     *
     * @method sanitize
     * @private
     * @param {*} value The value to sanitize.
     * @returns {Boolean} If the value is lower then 1 a false will be returned.
     */
    sanitize(value) {
        return (value > 1) ? true : false;
    }
}

module.exports = BooleanFilter;