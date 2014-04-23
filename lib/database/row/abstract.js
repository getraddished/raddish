var Service = require('../../service/service');
var util    = require('util');

/**
 *
 * @class RowAbstract
 * @constructor
 */
function RowAbstract() {
    RowAbstract.super_.apply(this, arguments);

    this.data = {};
    this.modified = {}
    this.new = true;
};

util.inherits(RowAbstract, Service);

/**
 * This function will set the data in the Row object,
 * when there is data present it will add data to the modified array.
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Row object with filled data
 */
RowAbstract.prototype.setData = function (data) {
    var self = this;
    var length = Object.keys(this.data).length;

    return new Promise(function(resolve, reject) {
        if (length > 0) {
            for(var index in data) {
                self.modified[index] = data[index];
                self.data[index] = data[index];
            }
        } else if(length <= 0) {
            self.data = data || {};
        }

        resolve(self);
    });
};

/**
 * This function will return only the data from the Row object
 *
 * @method getData
 * @returns {Promise} The data of the Row object
 */
RowAbstract.prototype.getData = function () {
    var self = this;

    return new Promise(function(resolve, reject) {
        resolve(self.data);
    });
};

/**
 * Function to check if the row object is new or not
 *
 * @method isNew
 * @returns {boolean} True if new, False if exists
 */
RowAbstract.prototype.isNew = function () {
    return this.new;
};

RowAbstract.prototype.clone = function() {
    return new RowAbstract();
}

module.exports = RowAbstract;