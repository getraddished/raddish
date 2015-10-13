"use strict";

var RowsetAbstract  = require('./abstract'),
    util            = require('util');

/**
 * Rowset object which is basically a collection of Row objects
 *
 * @class Rowset
 * @extends RowsetAbstract
 * @constructor
 */
function Rowset(config) {
    RowsetAbstract.call(this, config);
}

util.inherits(Rowset, RowsetAbstract);

/**
 * This method initializes the Rowset object.
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

    return RowsetAbstract.prototype.initialize.call(self, config)
        .then(function() {
            return self.getTable();
        })
        .then(function() {
            return self;
        });
};

/**
 * Return the table assiciated to the Rowset.
 *
 * @method getTable
 * @returns {Object} Return the table of the current rowset.
 */
Rowset.prototype.getTable = function() {
    var self = this;

    if(this.table) {
        return Promise.resolve(this.table);
    } else {
        var identifier = this.getIdentifier().clone();

        return this.getObject(identifier.setPath(['database', 'table']))
            .then(function(table) {
                self.table = table;

                return self.table;
            });
    }
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
