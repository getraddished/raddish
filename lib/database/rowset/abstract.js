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
                rowObj = rowObj.setData(data[index]);

                if(self.rows.indexOf(rowObj) == -1) {
                    self.rows.push(rowObj);
                }
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
 * This function will save all the rows in the rowset.
 * If one of the rows already exists, it will be updated.
 *
 * @returns {Promise} All the saved rows.
 */
RowsetAbstract.prototype.save = function() {
    var promises = [];

    for(var index in this.rows) {
        var row = this.rows[index];

        var promise = row.save();
        promises.push(promise);
    }

    return Promise.all(promises);
};

/**
 * This function will delete all the rows in the current rowset.
 * This however is only done when the row isn't new.
 *
 * @returns {Promise} All the removed rows.
 */
RowsetAbstract.prototype.delete = function() {
    var promises = [];

    for(var index in this.rows) {
        var row = this.rows[index];

        if(!row.isNew()) {
            var promise = row.delete();
            promises.push(promise);
        }
    }

    return Promise.all(promises);
};

/**
 * This method will return the first row object in the rowset.
 *
 * @returns {Row} The first row object in the rowset
 */
RowsetAbstract.prototype.first = function() {
    return this.rows[0];
};

/**
 * This method will return the last row object in the rowset.
 *
 * @returns {Row} The last row object in the rowset
 */
RowsetAbstract.prototype.last = function() {
    return this.rows[this.rows.length - 1];
};

/**
 * This method will return the total length of the rows.
 *
 * @returns {Number} The total rows in this rowset object.
 */
RowsetAbstract.prototype.count = function() {
    return this.rows.length;
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