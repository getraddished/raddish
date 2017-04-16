'use strict';

var AbstractFilter  = require('./abstract'),
    Filter          = require('./filter');

/**
 * The slug filter will check if a value is a slug or not.
 *
 * @class SlugFilter
 * @extends AbstractFilter
 */
class SlugFilter extends AbstractFilter {
    constructor() {
        super();

        this.separator = '-';
    }

    /**
     * The validate method will check if there are now unaccepted values in the slug.
     *
     * @method validate
     * @param value
     * @return {Boolean} True if the value is a correct slug, false otherwise
     */
    validate(value) {
        return Filter.get('cmd').validate(value);
    }

    /**
     * The sanitize will create a correct slug of the given value.
     *
     * @method sanitize
     * @param {*} value The value to sanitize
     * @return {string} The sanitized slug.
     */
    sanitize(value) {
        value = value.toString();

        value.replace(' ', this.separator);
        value = value.toLowerCase();
        value = value.trim();

        value = value.replace(/\s+/g, this.separator);
        value = value.replace(/[^A-Za-z0-9\-]/g, '');

        return value.replace(/[-]+/g, this.separator);
    }
}

module.exports = SlugFilter;