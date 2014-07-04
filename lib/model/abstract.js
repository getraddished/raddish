"use strict";

var Service = require('../service/service');
var States  = require('./states/states');
var util    = require('util');

/**
 * This is an abstract model function used when using a model without table
 * or creating your own model.
 *
 * @class ModelAbstract
 * @constructor
 */
function ModelAbstract(config) {
    this.states = new States();
    this.list = {};
    this.item = {};

    this.states
        .insert('limit', 'int')
        .insert('offset', 'int')
        .insert('sort', 'string')
        .insert('direction', 'string', 'asc');

    ModelAbstract.super_.call(this, config);
}

util.inherits(ModelAbstract, Service);

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
 * This function is used to set the states.
 *
 * @method set
 * @param {Object} states The states of the request
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

module.exports = ModelAbstract