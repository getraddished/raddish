"use strict";

var ObjectManager   = require('../../object/manager');
var util            = require('util');
var instances       = {};
var filters         = [];

/**
 * Abstract database adapter class
 * This class is used for extending for your own adapters
 *
 * @class AbstractAdapter
 */
function AbstractAdapter(config) {
    this.queryBuilder = undefined;

    // Only use columns known in the database.
    this.strictColumns = true;

    ObjectManager.call(this, config);
};

util.inherits(AbstractAdapter, ObjectManager);

/**
 * This function will return a single instance,
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

AbstractAdapter.prototype.getFilter = function(filter) {
    try {
        if(!filters[filter]) {
            var Filter = require('../../filter/' + filter);
            filters[filter] = new Filter();
        }

        return filters[filter];
    } catch(Error) {
        throw new RaddishError(500, 'Filter ' + filter + ' does not exist');
    }
};

module.exports = AbstractAdapter;