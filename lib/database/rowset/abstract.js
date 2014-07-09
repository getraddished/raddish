"use strict";

var ObjectManager   = require('../../object/manager');
var util            = require('util');

function RowsetAbstract(config) {
    ObjectManager.call(this, config);

    this.rows = [];
}

util.inherits(RowsetAbstract, ObjectManager);

/**
 * This function will set the data in the Rowset object,
 * This eccepts a array, for every entry it will create Row object and add it to the rows array
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Rowset object with filled data
 */
RowsetAbstract.prototype.setData = function (data) {
    var self = this;

    // TODO: There is stilla bug over here.
    return self.getRow()
        .then(function (row) {
            for(var index in data) {
                var rowObj = row.clone();
                self.rows.push(rowObj.setData(data[index]));
            }

            return self;
        });
};

/**
 * This function will return only the data from the Rowset object
 *
 * @method getData
 * @returns {Promise} The data of the Rowset object
 */
RowsetAbstract.prototype.getData = function () {
    var self = this;
    var data = [];

    for(var index in this.rows) {
        data.push(this.rows[index].getData());
    }

    return data;
};

/**
 * The RowsetAbstract will expect no database so it will try to get its sibling Row object.
 *
 * @method getRow
 * @returns {Promise}
 */
RowsetAbstract.prototype.getRow = function() {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'row']), null);
}

module.exports = RowsetAbstract;