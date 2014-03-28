var ControllerAbstract  = require('./abstract');
var util                = require('util');
var Inflector           = require('../inflector/inflector');

function Controller() {
    Controller.super_.apply(this, arguments);
};

util.inherits(Controller, ControllerAbstract);

Controller.prototype._actionGet = function (context) {
    var self = this;
    var localModel = undefined;
    
    return new Promise(function(resolve, reject) {
        self.getModel()
            .then(function(model) {
                localModel = model;
                
                if (Inflector.isPlural(self.request.url.query.view)) {
                    return model.getList();
                } else {
                    return model.getItem();
                }
            })
            .then(function(data) {
                context.result = {
                    data: data,
                    states: localModel.states.get()
                };
                
                resolve(context);
            });
    });
};

Controller.prototype._actionPost = function (data) {
    var self = this;
    var localModel = undefined;
    var row = undefined;

    this.getModel()
        .then(function (model) {
            localModel = model;
            return model.getItem();
        })
        .then(function (item) {
            return item.setData(data.fields);
        })
        .then(function (item) {
            row = item;

            return item.save()
        })
        .then(function (item) {
            return row.getData();
        })
        .then(function (data) {
            var obj = {
                item: data
            }

            self.response.end(JSON.stringify({
                item: data,
                states: localModel.states.get()
            }));
        });
};

Controller.prototype._actionDelete = function (data) {
    var self = this;
    var localModel = undefined;

    this.getModel()
        .then(function (model) {
            return model.getItem();
        })
        .then(function (item) {
            return item.delete();
        })
        .then(function (data) {
            self.response.end(JSON.stringify({
                deleted: data,
                states: model.states.get()
            }));
        });
};

module.exports = Controller;