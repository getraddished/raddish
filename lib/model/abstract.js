var Object = require('../base/base');
var States  = require('./states/states');
var util = require('util');

function ModelAbstract() {
    ModelAbstract.super_.apply(this, arguments);

    this.states = new States();
    this.list = {};
    this.item = {};

    this.states
        .insert('limit')
        .insert('offset')
        .insert('sort')
        .insert('direction');
}

util.inherits(ModelAbstract, Object);

ModelAbstract.prototype.getList = function(callback) {
    return this.list;
};

ModelAbstract.prototype.getItem = function(callback) {
    return this.item;
};

ModelAbstract.prototype.set = function (states) {
    for(index in states) {
        this.states.set(index, states[index]);
    }

    return this;
};

module.exports = ModelAbstract