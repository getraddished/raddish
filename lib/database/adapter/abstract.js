"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    instances       = {},
    filters         = [];

/**
 * Abstract database adapter class
 * This class is used for extending for your own adapters
 *
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

module.exports = AbstractAdapter;