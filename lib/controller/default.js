'use strict';

var AbstractController = require('./abstract');

class DefaultController extends AbstractController {
    /**
     * Generic GET method.
     * This method will check if the request is unique or not, if it is unique then a read action is excuted.
     * else a browse function is executed.
     *
     * @param {CommandContext} context The context of the current request.
     * @returns {Promise} A promise with the rendered view.
     * @private
     */
    _actionGet(context) {
        var self = this;

        return this.getModel(context.request.query)
            .then(function(model) {
                var method = model.state.isUnique() ? 'read' : 'browse';

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

    _actionDelete(context) {
        var self = this;

        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getItem()
                    .then(function(item) {
                        return item.delete();
                    })
                    .then(function(item) {
                        context.result = item;

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
                    })
            });
    }
}

module.exports = DefaultController;