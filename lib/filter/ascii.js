'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The ASCII filter to check the value for ASCII characters.
 *
 * @class AsciiFilter
 * @extends AbstractFilter
 * @constructor
 */
class AsciiFilter extends AbstractFilter {
    /**
     * The validate method checks if there are unaccepted characters in the value.
     * If so it resturns a false.
     *
     * @method validate
     * @private
     * @param {*} value The value to validate.
     * @returns {Boolean} If there are ASCII characters in the value it will return false.
     */
    validate(value) {
        var regex = /(?:[^\x00-\x7F])/;

        return !(regex.test(value));
    }

    /**
     * The sanitize method will change the ASCII values to html accepted characters.
     *
     * @method sanitize
     * @param {String} value The value to sanitize.
     * @returns {String} The sanitized value.
     * @private
     */
    sanitize(value) {
        value = value.toString();

        value = value.replace(/szlig;/, 'ss');
        value = value.replace(/(..)lig;/, '$1');
        value = value.replace(/([aouAOU])uml;/, '$1' + 'e');

        return value.replace(/&(.)[^;]*;/, '$1');
    }
}

module.exports = AsciiFilter;