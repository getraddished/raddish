'use strict';

var AbstractController = require('./abstract'),
    Inflector = require('inflected');

/**
 * The DefaultController class has functions for the basic/ default behavior for the requests.
 * In most cases you will be extending form this class.
 *
 * @class DefaultController
 * @extends AbstractController
 */
class DefaultController extends AbstractController {
    /**
     * Generic GET method.
     * This method will check if the request is unique or not, if it is unique then a read action is excuted.
     * else a browse function is executed.
     *
     * @method _actionGet
     * @param {CommandContext} context The context of the current request.
     * @returns {Promise} A promise with the rendered view.
     * @private
     */
    _actionGet(context) {
        var self = this,
            method = (!context.request.query['view'] || Inflector.pluralize(context.request.query['view']) === context.request.query['view']) ? 'browse' : 'read';
        
        return this.getModel(context.request.query)
            .then(function(model) {
                return self.execute(method, context)
                    .then(function() {
                        return self.getView();
                    })
                    .then(function(view) {
                        context.response.setHeader('Content-Type', view.contentType);

                        return view.execute('render', {
                            controller: self,
                            model: model,
                            data: context.result
                        });
                    });
            });
    }

    /**
     * Generic Browse method.
     * This method will get a list from the model based on the current request.
     *
     * @method _actionBrowse
     * @param {CommandContext} context The context of the current request.
     * @returns {Promise} A promise with the rendered view.
     * @private
     */
    _actionBrowse(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getList();
            });
    }

    /**
     * Generic Read method.
     * This method will get an item from the model based on the current request,
     * if the item isn't found a 404 is returned.
     *
     * @method _actionRead
     * @param {CommandContext} context The context of the current request.
     * @returns {Promise} A promise with the rendered view.
     * @private
     */
    _actionRead(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getItem();
            })
            .then(function(item) {
                if(item.isNew()) {
                    context.response.statusCode = 404;
                    throw new Error('Item not found!');
                }

                return item;
            });
    }

    /**
     * Generic Post method.
     * This method will check if the next method is to be an add or edit and will forward the request as such.
     *
     * @method _actionPost
     * @param {CommandContext} context The context of the current request.
     * @return {Promise} A promise containing the result of the call.
     * @private
     */
    _actionPost(context) {
        var self = this;

        return this.getModel(context.request.query)
            .then(function(model) {
                var state = model.state,
                    method = state.isUnique() ? 'edit' : 'add';

                return self.execute(method, context)
                    .then(function() {
                        return self.getView();
                    })
                    .then(function(view) {
                        context.response.setHeader('Content-Type', view.contentType);

                        return view.execute('render', {
                            controller: self,
                            model: model,
                            data: context.result
                        });
                    });
            });
    }

    /**
     * Generic Edit method.
     * This method will receive an item from the database, add the new data to this object,
     * and update it in the database.
     *
     * @method _actionEdit
     * @param {CommandContext} context The context of the current request.
     * @return {Promise} A promise containing the result of the request.
     * @private
     */
    _actionEdit(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getItem();
            })
            .then(function(item) {
                item.setData(context.request.data);

                return item.save();
            });
    }

    /**
     * Generic Add method
     * This method will add a new item to the database with the data provided in the request.
     *
     * @method _actionAdd
     * @param {CommandContext} context The context of the current request.
     * @return {Promise} A promise containing the result of the request.
     * @private
     */
    _actionAdd(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getItem();
            })
            .then(function(item) {
                item.setData(context.request.data);

                return item.save();
            });
    }

    /**
     * Generic Delete method.
     * This method tries to get a list of item(s), when this list is found,
     * all items in this list are removed.
     *
     * @method _actionDelete
     * @param {CommandContext} context The context of the current request.
     * @return {Promise} A promise containing the result of the request.
     * @private
     */
    _actionDelete(context) {
        var self = this;

        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getList()
                    .then(function(list) {
                        return list.delete();
                    })
                    .then(function(list) {
                        context.result = list;

                        return context;
                    })
                    .then(function() {
                        return self.getView();
                    })
                    .then(function(view) {
                        context.response.setHeader('Content-Type', view.contentType);

                        return view.execute('render', {
                            controller: self,
                            model: model,
                            data: context.result
                        });
                    });
            });
    }
}

module.exports = DefaultController;