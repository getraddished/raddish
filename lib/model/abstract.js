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
 * @class ModelAbstract
 * @extends ObjectManager
 * @constructor
 */
function ModelAbstract(config) {
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

util.inherits(ModelAbstract, ObjectManager);

/**
 * getList method which you need to override when you are fetching your own data.
 *
 * @method getList
 * @returns {Object} The retreived data from the data object.
 */
ModelAbstract.prototype.getList = function () {
    return new Promise.cast(this.list);
};

/**
 * getItem method which you need to override when you are fetching your own data.
 *
 * @method getItem
 * @returns {Object} The retreived data from the data object.
 */
ModelAbstract.prototype.getItem = function () {
    return new Promise.cast(this.item);
};

/**
 * getTotal which has the basic behavior of counting the rows in the current list.
 *
 * @method getTotal
 * @returns {Number} The total amount of rows.
 */
ModelAbstract.prototype.getTotal = function() {
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
 * @returns {ModelAbstract} The current model with set states.
 */
ModelAbstract.prototype.set = function (name, value) {
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
ModelAbstract.prototype.getTable = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return self.getObject(identifier.setPath(['database', 'table']).setName(Inflector.singularize(identifier.getName())))
        .then(function(table) {
            return table;
        });
};

module.exports = ModelAbstract