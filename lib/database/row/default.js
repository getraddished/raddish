"use strict";

var RowAbstract = require('./abstract'),
    util        = require('util');

/**
 * This class is a helper to structure data of the table,
 * this will only hold one table row.
 *
 * Also when extended the extra functions can be used.
 *
 * @class Row
 * @extends RowAbstract
 * @constructor
 */
function Row(config) {
    Row.super_.call(this, config);
}

util.inherits(Row, RowAbstract);

/**
 * This method will intialize the Row object.
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

    return RowAbstract.prototype.initialize.call(self, config)
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

/**
 * The load method will try to load the row from the database.
 *
 * @method load
 * @returns {Promise} The promise with the row object, or an empty row object.
 */
Row.prototype.load = function() {
    // This function will be slightly slower.
    var self = this;

    return this.getTable()
        .then(function(table) {
            return [table, table.getQuery()];
        })
        .spread(function(table, query) {
            query = query.select();
            query.table(table.getName());

            return [table, query, table.getUniqueColumns()];
        })
        .spread(function(table, query, columns) {
            for(var index in self.data) {
                if(columns[index]) {
                    query.where(columns[index].name, '=', self.data[index]);
                }
            }

            return table.select(query, 1);
        });

};

/**
 * This method tries to save the object to the database,
 * when it is new the object is inerted into the database if it exists the row is updated.
 *
 * @method save
 * @returns {Promise} Returns the returned data.
 */
Row.prototype.save = function () {
    var self = this;

    if(Object.keys(this.modified).length == 0 && !this.new) {
        return Promise.resolve(this);
    }

    return this.getTable()
        .then(function(table) {
            if(self.new) {
                return table.insert(self);
            } else {
                return table.update(self);
            }
        });
};

/**
 * This method tries to remove an entity from the database.
 *
 * @method delete
 * @returns {Promise}
 */
Row.prototype.delete = function () {
    var self = this;

    return this.getTable()
        .then(function(table) {
            return table.delete(self);
        });
};

/**
 * Return the table assiciated to the Row.
 *
 * @method getTable
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
 * This method will map the table columns to the values of the row object.
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

module.exports = Row;