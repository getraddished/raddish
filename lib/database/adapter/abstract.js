"use strict";

var Service     = require('../../service/service');
var util        = require('util');
var instances   = {};

/**
 * Abstract database adapter class
 * This class is used for extending for your own adapters
 *
 * @class AbstractAdapter
 */
function AbstractAdapter() {
    this.queryBuilder = undefined;
};

util.inherits(AbstractAdapter, Service);

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

module.exports = AbstractAdapter;