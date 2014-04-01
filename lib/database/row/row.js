var Base    = require('../../base/base');
var util    = require('util');
var squel   = require('squel');

/**
 * This class is a helper to structure data of the table,
 * this will only hold one table row.
 *
 * Also when extended the extra functions can be used.
 *
 * @class Row
 * @constructor
 */
function Row() {
    Row.super_.apply(this, arguments);

    this.data = {};
    this.modified = {}
    this.new = true;
}

util.inherits(Row, Base);

/**
 * This function will intialize the Row object.
 *
 * @method initialize
 * @param {Object} config The configuration of the Row object
 * @returns {Promise}
 */
Row.prototype.initialize = function (config) {
    var self = this;

    return new Promise(function (resolve, reject) {
        if (config.table) {
            self.table = config.table;
        }

        Row.super_.prototype.initialize.call(self, config)
            .then(function(row) {
                return self.table.getColumns();
            })
            .then(function(columns) {
                return self.mapColumns(columns);
            })
            .then(function(row) {
                resolve(self);
            });
    });
};

/**
 * This function will set the data in the Row object,
 * when there is data present it will add data to the modified array.
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Row object with filled data
 */
Row.prototype.setData = function (data) {
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
Row.prototype.getData = function () {
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
Row.prototype.isNew = function () {
    return this.new;
};

/**
 * This function tries to save the object to the database,
 * when it is new the object is inerted into the database if it exists the row is updated.
 *
 * @method save
 * @returns {Promise} Returns the returned data.
 */
Row.prototype.save = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        var query = self.new ? squel.insert() : squel.update();
        self.new ? query.into(self.table.getName()) : query.table(self.table.getName());

        if(self.new) {

            for(var index in self.data) {
                query.set(index, self.data[index]);
            };

            self.table.insert(query)
                .then(function (data) {
                    resolve(data);
                });
        } else {

            for(var index in self.modified) {
                query.set(index, self.modified[index]);
            };

            self.table.getUniqueColumns()
                .then(function (columns) {
                    for(var index in columns) {
                        query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
                    }

                    return self.table.update(query);
                })
                .then(function (data) {
                    resolve(data);
                });
        }
    });
};

/**
 * This function tries to remove an entity from the database.
 *
 * @method delete
 * @returns {Promise}
 */
Row.prototype.delete = function () {
    var row = this;
    var query = squel.delete()
    query.from(this.table.getName());

    return new Promise(function (resolve, reject) {
        row.table.getUniqueColumns()
            .then(function (columns) {
                for(var index in columns) {
                    query.where(columns[index].Field + ' = ?', row.data[columns[index].Field]);
                }

                return row.table.update(query);
            })
            .then(function (data) {
                resolve(data);
            });
    });
};

Row.prototype.mapColumns = function(columns) {
    var row = this;

    return new Promise(function(resolve, reject) {
        for(var index in columns) {
            row.data[columns[index].Field] = columns[index].Default;
        }

        resolve(row);
    });
}

Row.prototype.clone = function() {
    return new Row();
}

module.exports = Row;