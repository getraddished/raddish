'use strict';

var AbstractFilter  = require('./abstract');

/**
 * The RawFilter accepts any value and always returns true.
 * A RAW value just is the value and whatever the content might be, use with care.
 *
 * @class RawFilter
 * @constructor
 */
class RawFilter extends AbstractFilter {
    /**
     * A RAW value is always true.
     *
     * @method validate
     * @private
     * @param {*} value The value to be validated
     * @returns {boolean} If the value is valid or not.
     */
    validate() {
        return true;
    }

    /**
     * Return the RAW value.
     *
     * @method sanitize
     * @private
     * @param {*} value The value to be sanitzed.
     * @returns {*} The RAW value
     */
    sanitize(value) {
        return value;
    }
}

module.exports = RawFilter;