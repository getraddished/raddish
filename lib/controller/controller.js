var ControllerAbstract = require('./abstract');
var util = require('util');

function Controller() {
    Controller.super_.apply(this, arguments);
};

util.inherits(Controller, ControllerAbstract);

Controller.prototype._actionGet = function(data) {

    this.getView()
        .then(function(view) {
            view.display();
        });
};

Controller.prototype._actionPost = function(data) {
    var self = this;
    var localModel = undefined;
    var row = undefined;

    this.getModel()
        .then(function(model) {
            localModel = model;

            return model.getItem();
        })
        .then(function(item) {
            return item.setData(data.fields);
        })
        .then(function(item) {
            row = item;

            return item.save()
        })
        .then(function(item) {
            console.log(item);
            return row.getData();
        })
        .then(function(data) {
            console.log(data);
            var obj = {
                item: data
            }

            self.response.end(JSON.stringify({
                item: data,
                states: localModel.states.get()
            }));
        });
};

Controller.prototype._actionDelete = function(data) {
    var self = this;
    var localModel = undefined;

    this.getModel()
        .then(function(model) {
            localModel = model;
            return model.getItem();
        })
        .then(function(item) {
            return item.delete();
        })
        .then(function(data) {
            self.response.end(JSON.stringify({
                deleted: data,
                states: model.states.get()
            }));
        });
};

module.exports = Controller;