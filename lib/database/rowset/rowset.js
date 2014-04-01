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

    return new Promise(function (resolve, reject) {
        if (config.table) {
            self.table = config.table;
        }

        Rowset.super_.prototype.initialize.call(self, config)
            .then(function (rowset) {
                resolve(self);
            });
        });
};

Rowset.prototype.getRow = function() {
    return this.table.getRow();
};

module.exports = Rowset;