var AbstractFilter  = require('./abstract');

/**
 * The Integer filter will check if the object is an Integer or not.
 *
 * @class IntFilter
 * @constructor
 */
class IntFilter extends AbstractFilter {
    /**
     * The validate method will check if the value is a number or not
     * if the value is not a number false will be returned.
     *
     * @method validate
     * @private
     * @param {*} value The value to be validated.
     * @returns {boolean} If the value is valid or not.
     */
    validate(value) {
        return (typeof value == 'number') ? true : false;
    }

    /**
     * The sanitize method will force the value to be an integer.
     *
     * @method sanitize
     * @param {*} value The value to be sanitized.
     * @private
     * @returns {Number} The sanitized value.
     */
    sanitize(value) {
        return parseInt(value);
    }
}

module.exports = IntFilter;