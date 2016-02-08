"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    instances       = {};

/**
 * Abstract database adapter class
 * This class is used for extending for your own adapters
 *
 * @abstract
 * @class AbstractAdapter
 * @param {Object} config The config object received
 * @extends ObjectManager
 */
function AbstractAdapter(config) {
    this.queryBuilder = undefined;

    // Only use columns known in the database.
    this.strictColumns = true;

    ObjectManager.call(this, config);
}

util.inherits(AbstractAdapter, ObjectManager);

/**
 * This method will return a single instance,
 * if the instance isn't there it has to be created.
 *
 * @method getInstance
 * @param name
 * @param config
 */
AbstractAdapter.prototype.getInstance = function(name, config) {

};

/**
 * This function must return a query builder object, or sele when overridden.
 *
 * @method getQuery
 * @returns {undefined|*}
 */
AbstractAdapter.prototype.getQuery = function() {
    return this.queryBuilder;
};

/**
 * This method will create the schema to use.
 *
 * @method getSchema
 * @param {String} name The name of the table to get the schema from.
 * @returns {Promise} The promise containing the schema.
 */
AbstractAdapter.prototype.getSchema = function(name) {
    var result = {};
    var self = this;

    return this._fetchInfo(name)
        .then(function(info) {
            result.info = info;

            return self._fetchIndexes(name);
        })
        .then(function(indexes) {
            result.indexes = indexes;

            return self._fetchColumns(name);
        })
        .then(function(columns) {
            result.columns = columns;

            return result;
        });

};

module.exports = AbstractAdapter;