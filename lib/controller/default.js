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
function Controller(config) {
    Controller.super_.call(this, config);
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
    var data = undefined;

    var method = Inflector.isPlural(self.getRequest().view) ? 'browse' : 'read';

    return this.execute(method, context)
        .then(function(data) {
            return [self.getView(), data];
        })
        .spread(function(view, data) {
            self.response.setHeader('Content-Type', view.mimetype);
            view.setData(data);

            return view.display();
        })
        .then(function(data) {
            context.result = data;

            return context;
        });
};

Controller.prototype._actionBrowse = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getList();
        })
        .then(function(data) {
            context.result = data;

            return context;
        });
};

Controller.prototype._actionRead = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getItem();
        })
        .then(function(data) {
            context.result = data;

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
            var method = model.states.isUnique() ? 'edit' : 'add';

            return self.execute(method, context);
        })
        .then(function(data) {
            return [self.getView(), data];
        })
        .spread(function(view, data) {
            self.response.setHeader('Content-Type', view.mimetype);
            view.setData(data);

            return view.display();
        })
        .then(function(data) {
            context.result = data;

            return context;
        });
};

Controller.prototype._actionAdd = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getItem();
        })
        .then(function(item) {
            return item.setData(context.data.fields);
        })
        .then(function(row) {
            return [row.save(), row];
        })
        .spread(function(item, row) {
            row.table.mapColumns(row.data, true);
            context.result = row;

            return context;
        });
};

Controller.prototype._actionEdit = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getItem();
        })
        .then(function(item) {
            return item.setData(context.data.fields);
        })
        .then(function(row) {
            return [row.save(), row];
        })
        .spread(function(item, row) {
            row.table.mapColumns(row.data, true);
            context.result = row;

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
            return model.getItem();
        })
        .then(function (item) {
            return [item.delete(), item];
        })
        .spread(function(item, data) {
            return [self.getView(), data];
        })
        .spread(function(view, data) {
            self.response.setHeader('Content-Type', view.mimetype);
            view.setData(data);

            return view.display();
        })
        .then(function(data) {
            context.result = data;

            return context;
        });
};

module.exports = Controller;