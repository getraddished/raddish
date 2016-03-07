"use strict";

/**
 * This object holds the basic functionality and calls the private methods
 * located in its specialized fitlter.
 *
 * @class AbstractFilter
 * @constructor
 */
function AbstractFilter() {

}

/**
 * The public validate method will call the private method of the specialized filter object.
 *
 * @method validate
 * @param {*} value The value to validate.
 * @returns {Boolean} A boolean showing if the validate was successful or not.
 */
AbstractFilter.prototype.validate = function(value) {
    throw new RaddishError(404, 'Filter "validate" not yet implemented');
};

/**
 * If the validate method was unsuccessful the system will try to sanatize the value.
 *
 * @method sanitize
 * @param {*} value The value to sanatize.
 * @returns {*} The sanatized value.
 */
AbstractFilter.prototype.sanitize = function(value) {
    throw new RaddishError(404, 'Filter "sanitize" not yet implemented');
};

module.exports = AbstractFilter;