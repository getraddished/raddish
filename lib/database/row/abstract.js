"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util');

/**
 * The AbstractRow class can be used when not using a table, and thus can contain your own functions.
 *
 * @class AbstractRow
 * @extends ObjectManager
 * @constructor
 */
function AbstractRow(config) {
    ObjectManager.call(this, config);

    this.data = {};
    this.modified = {}
    this.new = true;
}

util.inherits(AbstractRow, ObjectManager);

/**
 * This method will set the data in the Row object,
 * when there is data present it will add data to the modified array and set this in the data as well.
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Row object with filled data
 */
AbstractRow.prototype.setData = function (data) {
    var length = Object.keys(this.data).length;

    if (length > 0 && !this.new) {
        for(var index in data) {
            this.modified[index] = data[index];
            this.data[index] = data[index];
        }
    } else {
        if(length == 0) {
            this.data = data || {};
        } else {
            for(var index in data) {
                this.data[index] = data[index];
            }
        }
    }

    return this;
};

/**
 * This method will return only the data from the Row object
 *
 * @method getData
 * @returns {Promise} The data of the Row object
 */
AbstractRow.prototype.getData = function () {
        return this.data;
};

/**
 * This method will check if the row object is new or not
 *
 * @method isNew
 * @returns {boolean} True if new, False if exists
 */
AbstractRow.prototype.isNew = function () {
    return this.new;
};

/**
 * This method will clone and reset the object, after this is done it will be returned.
 *
 * @method clone
 * @returns {AbstractRow} The newly created AbstractRow
 */
AbstractRow.prototype.clone = function() {
    var row = ObjectManager.prototype.clone.call(this);

    row.data = {};
    row.modified = {};
    row.new = true;

    return row;
}

module.exports = AbstractRow;