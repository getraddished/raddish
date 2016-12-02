'use strict';

var AbstractFilter = require('./abstract');

/**
 * The JSON filter will check if the value passed is valid JSON.
 *
 * @constructor
 * @class JsonFilter
 * @param {Object} config The config object.
 */
class JsonFilter extends AbstractFilter {
    /**
     * This method will try to check if the value is a string,
     * If so to validate it it must be able to be parsed.
     *
     * If the value is an object it is accepted.
     *
     * @method validate
     * @param {*} value The value to be validated
     * @returns {Boolean} If the value is a valid JSON.
     * @private
     */
    validate(value) {
        try {
            if(typeof value === 'string') {
                JSON.parse(value);
                return true;
            } else if (typeof value === 'object' && value !== null) {
                return true;
            }
        } catch(error) {
            return false;
        }
    }

    /**
     * The sanitize method will sanitize the value passed to a proper JSON string.
     *
     * @method sanitize
     * @param {*} value
     * @returns {*}
     * @private
     */
    sanitize(value) {
        return JSON.stringify(value);
    }
}

module.exports = JsonFilter;