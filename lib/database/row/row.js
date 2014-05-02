var RowAbstract = require('./abstract');
var util        = require('util');

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
}

util.inherits(Row, RowAbstract);

/**
 * This function will intialize the Row object.
 *
 * @method initialize
 * @param {Object} config The configuration of the Row object
 * @returns {Promise}
 */
Row.prototype.initialize = function (config) {
    var self = this;

    if (config.table) {
        this.table = config.table;
    }

    return Row.super_.prototype.initialize.call(self, config)
            .then(function(row) {
                return self.table.getColumns();
            })
            .then(function(columns) {
                return self.mapColumns(columns);
            })
            .then(function(row) {
                return self;
            });
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

    self.data = self.table.mapColumns(self.data);

    return self.table.getQuery()
        .then(function(query) {
            var query = self.new ? squel.insert() : squel.update();
            self.new ? query.into(self.table.getName()) : query.table(self.table.getName());

            if(self.new) {
                for(var index in self.data) {
                    if(typeof self.data[index] !== 'function') {
                        query.set(index, self.data[index]);
                    }
                };

                return self.table.insert(query)
                    .then(function (data) {
                        return data;
                    });
            } else {

                for(var index in self.modified) {
                    if(typeof self.data[index] !== 'function') {
                        query.set(index, self.data[index]);
                    }
                };

                return self.table.getUniqueColumns()
                    .then(function (columns) {
                        for(var index in columns) {
                            query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
                        }

                        return self.table.update(query);
                    })
                    .then(function (data) {
                        return data;
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


    return row.table.getQuery()
        .then(function(query) {
            query.from(this.table.getName());

            return [query, row.table.getUniqueColumns()]
        })
        .then(function (query, columns) {
            for(var index in columns) {
                query.where(columns[index].Field + ' = ?', row.data[columns[index].Field]);
            }

            return row.table.update(query);
        })
        .then(function (data) {
            return data;
        });
};

Row.prototype.mapColumns = function(columns) {
    var row = this;

    return new Promise(function(resolve, reject) {
        for(var index in columns) {
            row.data[index] = columns[index].value;
        }

        resolve(row);
    });
};

Row.prototype.clone = function() {
    return new Row();
}

module.exports = Row;