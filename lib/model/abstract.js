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
console.log('Called');
function ModelAbstract() {
    this.states = new States();
    this.list = {};
    this.item = {};

    this.states
        .insert('limit')
        .insert('offset')
        .insert('sort')
        .insert('direction');

    ModelAbstract.super_.call(this);
}

util.inherits(ModelAbstract, Service);

/**
 * getList method which you need to override when you are fetching your own data.
 *
 * @method getList
 * @returns {Object} The retreived data from the data object.
 */
ModelAbstract.prototype.getList = function (callback) {
    return new Promise.resolve(this.list);
};

/**
 * getItem method which you need to override when you are fetching your own data.
 *
 * @method getItem
 * @returns {Object} The retreived data from the data object.
 */
ModelAbstract.prototype.getItem = function (callback) {
    return new Promise.resolve(this.item);
};

/**
 * This function is used to set the states.
 *
 * @method set
 * @param {Object} states The states of the request
 * @returns {ModelAbstract} The current model with set states.
 */
ModelAbstract.prototype.set = function (states) {
    for(index in states) {
        this.states.set(index, states[index]);
    }

    return this;
};

module.exports = ModelAbstract