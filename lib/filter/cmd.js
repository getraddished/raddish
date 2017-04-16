'use strict';

var AbstractFilter = require('./abstract');

/**
 * This class will check if the values given is safe to be executed.
 * If not it will replace any of the unsafe characters.
 *
 * @class CmdFilter
 * @extends AbstractFilter
 */
class CmdFilter extends AbstractFilter {
    /**
     * This method will check if the value given is safe to be executed.
     *
     * @method validate
     * @param {*} value The value to validate.
     * @return {Boolean} True when the value is correct otherwise false.
     */
    validate(value) {
        value = value.toString();

        return /^[A-Za-z0-9.\-_]*$/.test(value);
    }

    /**
     * This method will sanitize the value, any characters no valid for a command will be stripped.
     *
     * @method sanitize
     * @param {*} value The value to sanitize.
     * @return {String} The sanitized value in string form.
     */
    sanitize(value) {
        value = value.toString();
        value = value.trim();

        return value.replace(/[^A-Za-z0-9.\-_]*/g, '');
    }
}

module.exports = CmdFilter;