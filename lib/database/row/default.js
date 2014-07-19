"use strict";

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
function Row(config) {
    Row.super_.call(this, config);
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
        .then(function() {
            return self.getTable();
        })
        .then(function() {
            return self.table.getColumns();
        })
        .then(function(columns) {
            return self.mapColumns(columns);
        });
};

Row.prototype.load = function() {
    // This function will be slightly slower.
    var self = this;

    return this.table.getQuery()
        .then(function(query) {
            query = query.select();
            query.table(self.table.getName());

            return [query, self.table.getUniqueColumns()];
        })
        .spread(function(query, columns) {
            for(var index in self.data) {
                if(columns[index]) {
                    query.where(columns[index].name, '=', self.data[index]);
                }
            }

            return self.table.select(query, 1);
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
    if(this.new) {
        return this.table.insert(this);
    } else {
        return this.table.update(this);
    }
};

/**
 * This function tries to remove an entity from the database.
 *
 * @method delete
 * @returns {Promise}
 */
Row.prototype.delete = function () {
    return this.table.delete(this);
};

/**
 * Return the table assiciated to the Row.
 *
 * @returns {Object} Return the table of the current row.
 */
Row.prototype.getTable = function() {
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
 * This function will map the table columns to the values of the row object.
 * Default table column values are supported.
 *
 * @method mapColumns
 * @param {Object} columns All the columns from the table.
 * @returns {Row} The current row object for chaining.
 */
Row.prototype.mapColumns = function(columns) {
    for(var index in columns) {
        this.data[index] = columns[index].value;
    }

    return this;
};

/**
 * This function will clone the object and return a new Row object.
 *
 * @method clone
 * @returns {Row}
 */
Row.prototype.clone = function() {
    return new Row({
        identifier: this.getIdentifier()
    });
};

module.exports = Row;