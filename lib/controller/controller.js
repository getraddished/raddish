"use strict";

var ControllerAbstract  = require('./abstract');
var util                = require('util');
var Inflector           = require('../inflector/inflector');

/**
 * Controller class
 * This is the default called on every request,
 * when overwritten a controller object will inherit from this object or the abstract.
 *
 * @class Controller
 * @constructor
 */
function Controller() {
    Controller.super_.apply(this, arguments);
};

util.inherits(Controller, ControllerAbstract);

/**
 * This function will react on a GET request.
 * This function will check if the view is singular if it is than the getItem function of the model is called,
 * else the getList function is called.
 *
 * @method _actionGet
 * @param {Object} context Context object with the request data.
 * @returns {Promise} The data of the model.
 */
Controller.prototype._actionGet = function (context) {
    var self = this;

    return this.getModel()
        .then(function(model) {
            if (Inflector.isPlural(self.request.url.query.view)) {
                return [model.getList(), model];
            } else {
                return [model.getItem(), model];
            }
        })
        .spread(function(data, model) {
            context.result = {
                data: data,
                states: model.states.get()
            };

            return context;
        });
};

/**
 * This function is called on a POST request,
 * it will check if there is an item in the database, if so it will update that item
 * if not it will create a new one with the supplied data.
 *
 * @method _actionPost
 * @param {Object} context Context object with the request data.
 * @returns {Promise} The data of the update/ inserted item.
 */
Controller.prototype._actionPost = function (context) {
    var self = this;

    return this.getModel()
        .then(function (model) {
            return [model.getItem(), model];
        })
        .spread(function (item, model) {
            return [item.setData(context.fields), model];
        })
        .spread(function (item, model) {
            return [item.save(), model, item]
        })
        .spread(function (item, model, row) {
            context.result = {
                data: row,
                states: model.states.get()
            };

            return context;
        });
};

/**
 * This function is called on a DELETE method,
 * this will remove an item from the database.
 *
 * @method _actionDelete
 * @param {Object} context Context object with the request data.
 * @returns {Promise} The data of the removed item.
 */
Controller.prototype._actionDelete = function (context) {
    var self = this;

    return this.getModel()
        .then(function (model) {
            return [model.getItem(), model];
        })
        .spread(function (item, model) {
            return [item.delete(), model, item];
        })
        .spread(function (data, model, row) {
            context.result = {
                data: row,
                states: model.states.get()
            };

            return context;
        });
};

module.exports = Controller;