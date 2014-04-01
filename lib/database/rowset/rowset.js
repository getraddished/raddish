var Base    = require('../../base/base');
var async   = require('async');
var util    = require('util');

/**
 * Rowset object which is basically a collection of Row objects
 *
 * @class Rowset
 * @constructor
 */
function Rowset() {
    Rowset.super_.apply(this, arguments);

    this.rows = [];
}

util.inherits(Rowset, Base);

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

/**
 * This function will set the data in the Rowset object,
 * This eccepts a array, for every entry it will create Row object and add it to the rows array
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Rowset object with filled data
 */
Rowset.prototype.setData = function (data) {
    var self = this;

    // TODO: There is stilla bug over here.
    return new Promise(function (resolve, reject) {
        self.table.getRow()
            .then(function (row) {
                for(var index in data) {
                    var rowObj = row.clone();
                    self.rows.push(rowObj.setData(data[index]));
                }

                resolve(self);
            });
    });
};

/**
 * This function will return only the data from the Rowset object
 *
 * @method getData
 * @returns {Promise} The data of the Rowset object
 */
Rowset.prototype.getData = function () {
    var self = this;
    var data = [];
    var rows = [];

    return new Promise(function (resolve, reject) {
        Promise.all(self.rows)
            .then(function(results) {
                for(var index in results) {
                    rows.push(results[index].getData())
                }

                return Promise.all(rows);
            })
            .then(function(results) {
                resolve(results);
            });
    });
};

module.exports = Rowset;