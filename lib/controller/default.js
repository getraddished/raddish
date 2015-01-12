"use strict";

var ControllerAbstract  = require('./abstract'),
    util                = require('util'),
    Inflector           = require('../inflector/inflector');

/**
 * Controller class
 * This is the default called on every request,
 * when overwritten a controller object will inherit from this object or the abstract.
 *
 * @class Controller
 * @extends ControllerAbstract
 * @constructor
 */
function Controller(config) {
    ControllerAbstract.call(this, config);
}

util.inherits(Controller, ControllerAbstract);

/**
 * This function will react on a GET request.
 * This function will check if the view is singular if it is than _actionRead is called, else _actionBrowse is called,
 * else the getList function is called.
 *
 * @method _actionGet
 * @param {Object} context Context object with the request data.
 * @returns {Promise} The data of the model.
 */
Controller.prototype._actionGet = function (context) {
    var self = this;

    var method = Inflector.isPlural(self.getRequest().view) ? 'browse' : 'read';

    return this.execute(method, context)
        .then(function(data) {
            return [self.getView(), data];
        })
        .spread(function(view, data) {
            view.setData(data.result);
            context.result = view;
            context.status = 200;

            return context;
        });
};

/**
 * This action will react on a PUT request,
 * The complete context of this action will be forwarded to _actionPost
 *
 * @method _actionPut
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
Controller.prototype._actionPut = function(context) {
    return this.forward('post', context);
};

/**
 * This action will react on a PATCH request,
 * The complete context of this action will be forwarded to _actionPost
 *
 * @method _actionPatch
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
Controller.prototype._actionPatch = function(context) {
    return this.forward('post', context);
};

/**
 * _actionBrowse will return a list of items,
 * after this action has been called it will return the data to _actionGet.
 *
 * @method _actionBrowse
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
Controller.prototype._actionBrowse = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getList();
        })
        .then(function(data) {
            context.result = data;
            context.status = 200;

            return context;
        });
};

/**
 * _actionBrowse will return a single item,
 * after this action has been called it will return the data to _actionGet.
 *
 * @method _actionRead
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
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
 * When the state is unique _actionEdit is called else _actionAdd will be called.
 * The returned data for these actions will be handled afterwards.
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
            view.setData(data.result);
            context.result = view;

            return context;
        });
};

/**
 * _actionAdd will add a new record to the database.
 * After this is done the data is returned to _actionPost.
 *
 * @method _actionAdd
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
Controller.prototype._actionAdd = function(context) {
    return this.getModel()
        .then(function(model) {
            return model.getItem();
        })
        .then(function(row) {
            return row.setData(context.data.fields);
        })
        .then(function(row) {
            return row.save();
        })
        .then(function(row) {
            context.result = row;
            context.status = 201;

            return context;
        });
};

/**
 * _actionEdit will update an record in the database.
 * After this is done the data is returned to _actionPost.
 *
 * @method _actionEdit
 * @param {CommandContext} context Context object with the request data
 * @returns {Promise} The promise with the context to use afterwards
 * @private
 */
Controller.prototype._actionEdit = function(context) {
    var self = this;

    return this.getModel()
        .then(function(model) {
            return model.getItem();
        })
        .then(function(item) {
            return item;
        })
        .then(function(item) {
            return item.setData(context.data.fields);
        })
        .then(function(row) {
            return row.save();
        })
        .then(function(row) {
            context.result = row;
            context.status = 205;

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
            return item;
        })
        .then(function (item) {
            return [self.getView(), item.delete()];
        })
        .spread(function (view, data) {
            view.setData(data);
            context.result = view;
            context.status = 204;

            return context;
        });
};

module.exports = Controller;