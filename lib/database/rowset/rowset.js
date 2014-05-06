var RowsetAbstract  = require('./abstract');
var async           = require('async');
var util            = require('util');

/**
 * Rowset object which is basically a collection of Row objects
 *
 * @class Rowset
 * @constructor
 */
function Rowset() {
    Rowset.super_.apply(this, arguments);
}

util.inherits(Rowset, RowsetAbstract);

/**
 * This function initializes the Rowset object.
 *
 * @method initialize
 * @param {Object|null} config The config for the rowset object
 * @returns {Promise} Returns the initialized Rowset object
 */
Rowset.prototype.initialize = function (config) {
    var self = this;

    if (config.table) {
        this.table = config.table;
    }

    return Rowset.super_.prototype.initialize.call(self, config);
};

/**
 * The Rowset will expects a table so it will call the getRow from the table object.
 *
 * @method getRow
 * @returns {Promise}
 */
Rowset.prototype.getRow = function() {
    return this.table.getRow();
};

module.exports = Rowset;