var Abstract    = require('./abstract'),
    ObjectID    = require('mongodb').ObjectID,
    util        = require('util');

/**
 * The MongoIDFilter is a special filter created for the MongoDB _id column.
 *
 * @class MingoIDFilter
 * @constructor
 */
function MongoIDFilter() {
    Abstract.call(this);
}

util.inherits(MongoIDFilter, Abstract);

/**
 * The validate method will check if the value is an instance of ObjectID,
 * if not a false will be returned.
 *
 * @method _validate
 * @private
 * @param {*} value The value to be sanitized.
 * @returns {boolean}
 */
MongoIDFilter.prototype._validate = function(value) {
    return (value instanceof ObjectID) ? true : false;
};

/**
 * The sanitize method will force the value to be an ObjectID.
 *
 * @method _sanitize
 * @private
 * @param {*} value The value to be sanitized.
 * @returns {ObjectID} The sanitized ObjectID.
 */
MongoIDFilter.prototype._sanitize = function(value) {
    return new ObjectID(value);
};

module.exports = MongoIDFilter;