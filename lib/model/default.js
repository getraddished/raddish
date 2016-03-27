"use strict";

var AbstractModel   = require('./abstract'),
    util            = require('util'),
    clone           = require('clone');

/**
 * Default model used in most cases.
 *
 * @class Model
 * @extends AbstractModel
 * @param config The config object.
 * @constructor
 */
function Model(config) {
    AbstractModel.call(this, config);
}

util.inherits(Model, AbstractModel);

Model.prototype.initialize = function (config) {
    var self = this;

    return AbstractModel.prototype.initialize.call(self, config)
        .then(function () {
            return self.getTable();
        })
        .then(function (table) {
            return table.getUniqueColumns();
        })
        .then(function (columns) {
            for(var index in columns) {
                if(columns.hasOwnProperty(index)) {
                    self.states.insert(index, columns[index].type, null, true);
                }
            }

            return self;
        });
};

/**
 * getItem override of AbstractModel, this will create a complete query and execute this query on the table.
 *
 * @method getItem
 * @returns {Promise} The promise with a single item from the table as content.
 */
Model.prototype.getItem = function () {
    var self = this;

    return AbstractModel.prototype.getItem.call(this)
        .then(function() {
            if(self.states.isUnique()) {
                return self.getTable()
                    .then(function (table) {
                        return table.getQuery()
                            .then(function(query) {
                                return Promise.resolve(query.select())
                                    .then(self.buildQueryColumns.bind(self))
                                    .then(self.buildQueryFrom.bind(self))
                                    .then(self.buildQueryJoins.bind(self))
                                    .then(self.buildQueryWhere.bind(self))
                                    .then(self.buildQueryGroup.bind(self))
                                    .then(self.buildQueryHaving.bind(self));
                            })
                            .then(function(query) {
                                var context = table.getContext()
                                    .setParameter('query', query)
                                    .setParameter('mode', 1);

                                return table.execute('select', context);
                            });
                    })
            } else {
                return self.getTable()
                    .then(function (table) {
                        return table.getRow();
                    });
            }
        });
};

/**
 * This method will retreive a complete list of objects from the table,
 * this will also create a query using the buildQuery methods.
 *
 * @method getList
 * @returns {Promise} A promise with the list of object as content
 */
Model.prototype.getList = function () {
    var self = this;

    return AbstractModel.prototype.getList.call(this)
        .then(function() {
            return self.getTable();
        })
        .then(function (table) {
            return table.getQuery()
                .then(function(query) {
                    return Promise.resolve(query.select())
                        .then(self.buildQueryColumns.bind(self))
                        .then(self.buildQueryFrom.bind(self))
                        .then(self.buildQueryJoins.bind(self))
                        .then(self.buildQueryWhere.bind(self))
                        .then(self.buildQueryGroup.bind(self))
                        .then(self.buildQueryHaving.bind(self))
                        .then(self.buildQueryOrder.bind(self))
                        .then(self.buildQueryLimit.bind(self));
                })
                .then(function(query) {
                    var context = table.getContext()
                        .setParameter('query', query)
                        .setParameter('mode', 2);

                    return table.execute('select', context);
                });
        });
};

/**
 * A special query is being build to get the total of objects from the table.
 *
 * TODO: This method also has to be refactored!
 *
 * @method getTotal
 * @returns {Promise} A promise holding the total number of objects as content.
 */
Model.prototype.getTotal = function () {
    var self = this;

    return self.getTable()
        .then(function (table) {
            return table.getQuery()
                .then(function(query) {
                    return Promise.resolve(query.select())
                        .then(self.buildQueryColumns.bind(self))
                        .then(self.buildQueryFrom.bind(self))
                        .then(self.buildQueryJoins.bind(self))
                        .then(self.buildQueryWhere.bind(self))
                        .then(self.buildQueryGroup.bind(self))
                        .then(self.buildQueryOrder.bind(self));
                })
                .then(function(query) {
                    return table.getAdapter()
                        .then(function(adapter) {
                            query.count();

                            return adapter.execute(query);
                        })
                });
        })
        .then(function(data) {
            return data[0]['COUNT(*)'];
        });
};

/**
 * buildQueryColumns will determine which columns need to be fetched from the table.
 * by default this is "tbl.*"
 *
 * @method buildQueryColumns
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryColumns = function (query) {
    query.columns('tbl.*');

    return query;
};

/**
 * The buildQuiryFrom method will determin from which table the data needs to be fetched.
 * This table will get the alias "tbl" by default.
 *
 * @method buildQueryFrom
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryFrom = function (query) {
    return this.getTable()
        .then(function(table) {
            query.table(table.getName(), 'tbl');

            return query;
        });
};

/**
 * The buildQueryJoins will define which joins need to be made.
 * By default no joins are made.
 *
 * @method buildQueryJoins
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryJoins = function (query) {
    return query;
};

/**
 * The buildQueryWhere will create the where statements on the query.
 * By default unique states are filtered, this only happens when they have a value.
 *
 * @method buildQueryWhere
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryWhere = function (query) {
    var states = clone(this.states.get());

    return this.getTable()
        .then(function(table) {
            states = table.mapColumns(states);

            for(var index in states) {
                if (states[index].unique && states[index].value) {
                    query.where('tbl.' + index, '=', states[index].value);
                }
            }

            return query;
        });
};

/**
 * The buildQueryGroup will group the row together.
 * By default no group query is made.
 *
 * @method buildQueryGroup
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryGroup = function (query) {
    return query;
};

/**
 * The buildQueryHaving will add a having statement to the query.
 * By default no having statements will be added.
 *
 * @method buildQueryHaving
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryHaving = function (query) {
    return query;
};

/**
 * The buildQueryOrder will determine the order and direction on which to sort.
 * By default the state sort and direction are used.
 * When the state sort has a value this value is used, and by default the order is ascending,
 * unless the direction state has been modified.
 *
 * @method buildQueryOrder
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryOrder = function (query) {
    var order = this.states.get('sort');
    var direction = this.states.get('direction');

    if(order.value) {
        query.order(order.value, direction.value);
    }

    return query;
};

/**
 * BuildQueryLimit will use the limit and offset states to return the records
 * When both aren't specified the default of limit is "20" and the default of offset is "0".
 *
 * @method buildQueryLimit
 * @param {Object} query The querybuilder object
 * @returns {Object} The querybuilder object.
 */
Model.prototype.buildQueryLimit = function (query) {
    var limit = this.states.get('limit');
    var offset = this.states.get('offset');

    if (limit.value > 0) {
        query.limit(limit.value);
    }

    if (offset.value > 0) {
        query.offset(offset.value);
    }

    return query;
};

module.exports = Model;
