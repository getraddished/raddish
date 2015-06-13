"use strict";

var ObjectManager   = require('../../object/manager'),
    util            = require('util');

/**
 * The AbstractRowset class can be used without a table,
 * you can use this when using an external API.
 *
 * @class AbstractRowset
 * @extends ObjectManager
 * @param {Object} config The basic config
 * @constructor
 */
function AbstractRowset(config) {
    ObjectManager.call(this, config);

    this.rows = [];
}

util.inherits(AbstractRowset, ObjectManager);

/**
 * This method will set the data in the Rowset object,
 * This accepts a array, for every entry it will create Row object and add it to the rows array
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Rowset object with filled data
 */
AbstractRowset.prototype.setData = function (data) {
    var self = this;

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
 * This method will return only the data from the Rowset object
 *
 * @method getData
 * @returns {Promise} The data of the Rowset object
 */
AbstractRowset.prototype.getData = function () {
    var data = [];

    for(var index in this.rows) {
        data.push(this.rows[index].getData());
    }

    return data;
};

/**
 * This method will save all the rows in the rowset.
 * If one of the rows already exists, it will be updated.
 *
 * @method save
 * @returns {Promise} All the saved rows.
 */
AbstractRowset.prototype.save = function() {
    var promises = [];

    for(var index in this.rows) {
        var row = this.rows[index];

        var promise = row.save();
        promises.push(promise);
    }

    return Promise.all(promises);
};

/**
 * This method will delete all the rows in the current rowset.
 * This however is only done when the row isn't new.
 *
 * @method delete
 * @returns {Promise} All the removed rows.
 */
AbstractRowset.prototype.delete = function() {
    var promises = [];

    if(this.rows.length > 0) {
        for(var index in this.rows) {
            var row = this.rows[index];

            if(!row.isNew()) {
                var promise = row.delete();
                promises.push(promise);
            }
        }
    }

    return Promise.all(promises);
};

/**
 * This method will return the first row object in the rowset.
 *
 * @method first
 * @returns {Row} The first row object in the rowset
 */
AbstractRowset.prototype.first = function() {
    return this.rows[0];
};

/**
 * This method will return the last row object in the rowset.
 *
 * @method last
 * @returns {Row} The last row object in the rowset
 */
AbstractRowset.prototype.last = function() {
    return this.rows[this.rows.length - 1];
};

/**
 * This method will return the total length of the rows.
 *
 * @method count
 * @returns {Number} The total rows in this rowset object.
 */
AbstractRowset.prototype.count = function() {
    return this.rows.length;
};

/**
 * The AbstractRowset will expect no database so it will try to get its sibling Row object.
 *
 * @method getRow
 * @returns {Promise}
 */
AbstractRowset.prototype.getRow = function() {
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'row']), null);
}

module.exports = AbstractRowset;