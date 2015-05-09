var Abstract    = require('./abstract'),
    util        = require('util');

/**
 * The BooleanFilter will check for booleans.
 *
 * @class BooleanFilter
 * @constructor
 */
function BooleanFilter() {
    Abstract.call(this);
};

util.inherits(BooleanFilter, Abstract);

/**
 * The validate method checks if the values is a true or false.
 *
 * @method _validate
 * @private
 * @param {*} value The value to evaluate.
 * @returns {boolean} The the value is a boolean true will be returned.
 */
BooleanFilter.prototype._validate = function(value) {
    return (value == true || value == false);
};

/**
 * The sanitize method will check if the value given is bigger than 0,
 * if so a true will be returned
 *
 * @method _sanitize
 * @private
 * @param {*} value The value to sanitize.
 * @returns {Boolean} If the value is lower then 1 a false will be returned.
 */
BooleanFilter.prototype._sanitize = function(value) {
    // Make an extra check.
    return (value > 1) ? true : false;
};

module.exports = BooleanFilter;