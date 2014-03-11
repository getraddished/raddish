var ControllerAbstract = require('./abstract');
var util = require('util');

function Controller() {
    Controller.super_.apply(this, arguments);
};

util.inherits(Controller, ControllerAbstract);

Controller.prototype._actionGet = function(data) {
    // Null, you have to overwrite
};

Controller.prototype._actionPost = function(data) {
    // Null, you have to overwrite
};

Controller.prototype._actionDelete = function(data) {
    // Null, you have to overwrite
};

module.exports = Controller;