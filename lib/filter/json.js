var AbstractFilter = require('./abstract'),
    util = require('util');

/**
 * The JSON filter will check if the value passed is valid JSON.
 *
 * @constructor
 * @class JsonFilter
 * @param {Object} config The config object.
 */
function JsonFilter(config) {
    AbstractFilter.call(this, config);
};

util.inherits(JsonFilter, AbstractFilter);

/**
 * This method will try to check if the value is a string,
 * If so to validate it it must be able to be parsed.
 *
 * If the value is an object it is accepted.
 *
 * @param {*} value The value to be validated
 * @returns {Boolean} If the value is a valid JSON.
 * @private
 */
JsonFilter.prototype._validate = function(value) {
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
};

/**
 * The sanitize method will sanitize the value passed to a proper JSON string.
 *
 * @param {*} value
 * @returns {*}
 * @private
 */
JsonFilter.prototype._sanitize = function(value) {
    return JSON.stringify(value);
};

module.exports = JsonFilter;