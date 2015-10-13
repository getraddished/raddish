"use strict";

var ObjectManager   = require('../object/manager'),
    States          = require('./states/states'),
    Inflector       = require('../inflector/inflector'),
    util            = require('util');

/**
 * This is an abstract model, used when using a model without table,
 * or creating your own model.
 *
 * This will create the states and set some predefined states which can be used at will.
 *
 * @class AbstractModel
 * @extends ObjectManager
 * @constructor
 */
function AbstractModel(config) {
    this.states = new States();
    this.list = {};
    this.item = {};

    this.states
        .insert('limit', 'int', 20)
        .insert('offset', 'int', 0)
        .insert('sort', 'string')
        .insert('direction', 'string', 'asc');

    ObjectManager.call(this, config);
}

util.inherits(AbstractModel, ObjectManager);

/**
 * getList method which you need to override when you are fetching your own data.
 *
 * @method getList
 * @returns {Object} The retreived data from the data object.
 */
AbstractModel.prototype.getList = function () {
    return Promise.resolve(this.list);
};

/**
 * getItem method which you need to override when you are fetching your own data.
 *
 * @method getItem
 * @returns {Object} The retreived data from the data object.
 */
AbstractModel.prototype.getItem = function () {
    return Promise.resolve(this.item);
};

/**
 * getTotal which has the basic behavior of counting the rows in the current list.
 *
 * @method getTotal
 * @returns {Number} The total amount of rows.
 */
AbstractModel.prototype.getTotal = function() {
    if(!this.total) {
        return this.getList()
            .then(function(list) {
                return list.rows.length;
            });
    } else {
        return this.total;
    }
};

/**
 * This method is used to set the states.
 * This method accepts an array or a string as the first parameter.
 * When the first parameter is a string the second parameter will be the value of this state.
 *
 * @method set
 * @param {Object|string} name The state/ array of states to set
 * @param {*} value The value of the state
 * @returns {AbstractModel} The current model with set states.
 */
AbstractModel.prototype.set = function (name, value) {
    if(typeof name == 'string') {
        this.states.set(name, value);
    } else if(typeof name == 'object') {
        for(var index in name) {
            this.states.set(index, name[index]);
        }
    }

    return this;
};

/**
 * This method will return the table connected to the current model.
 *
 * @method getTable
 * @returns {Promise} The promise holding the table object as content.
 */
AbstractModel.prototype.getTable = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return self.getObject(identifier.setPath(['database', 'table']).setName(Inflector.singularize(identifier.getName())))
        .then(function(table) {
            return table;
        });
};

module.exports = AbstractModel
