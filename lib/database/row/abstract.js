"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util');

/**
 * The RowAbstract class can be used when not using a table, and thus can contain your own functions.
 *
 * @class RowAbstract
 * @extends ObjectManager
 * @constructor
 */
function RowAbstract(config) {
    ObjectManager.call(this, config);

    this.data = {};
    this.modified = {}
    this.new = true;
};

util.inherits(RowAbstract, ObjectManager);

/**
 * This method will set the data in the Row object,
 * when there is data present it will add data to the modified array and set this in the data as well.
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Row object with filled data
 */
RowAbstract.prototype.setData = function (data) {
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
RowAbstract.prototype.getData = function () {
        return this.data;
};

/**
 * This method will check if the row object is new or not
 *
 * @method isNew
 * @returns {boolean} True if new, False if exists
 */
RowAbstract.prototype.isNew = function () {
    return this.new;
};

/**
 * This function will clone the object and return a new RowAbstract object.
 *
 * @method clone
 * @returns {RowAbstract} The newly created RowAbstract
 */
RowAbstract.prototype.clone = function() {
    return new RowAbstract({
        identifier: this.getIdentifier()
    });
}

module.exports = RowAbstract;