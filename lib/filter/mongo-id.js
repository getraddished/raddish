var AbstractFilter  = require('./abstract'),
    ObjectID        = require('mongodb').ObjectID;

/**
 * The MongoIDFilter is a special filter created for the MongoDB _id column.
 *
 * @class MongoIDFilter
 * @constructor
 */
class MongoIDFilter extends AbstractFilter {
    /**
     * The validate method will check if the value is an instance of ObjectID,
     * if not a false will be returned.
     *
     * @method validate
     * @private
     * @param {*} value The value to be sanitized.
     * @returns {boolean}
     */
    validate(value) {
        return (value instanceof ObjectID) ? true : false;
    }

    /**
     * The sanitize method will force the value to be an ObjectID.
     *
     * @method sanitize
     * @private
     * @param {*} value The value to be sanitized.
     * @returns {ObjectID} The sanitized ObjectID.
     */
    sanitize(value) {
        return new ObjectID(value);
    }
}

module.exports = MongoIDFilter;