'use strict';

var AbstractController = require('./abstract');

class DefaultController extends AbstractController {
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
                        return view.execute('render', {
                            controller: self,
                            model: model,
                            data: context.result
                        });
                    });
            });
    }

    _actionBrowse(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getList();
            });
    }

    _actionRead(context) {
        return this.getModel(context.request.query)
            .then(function(model) {
                return model.getItem();
            });
    }

    _actionPost(context) {
        var self = this;

        return this.getModel()
            .then(function(model) {
                var state = model.state,
                    method = state.isUnique() ? 'edit' : 'add';

                return self.execute(method, context);
            });
    }

    _actionEdit(context) {
        
    }

    _actionAdd(context) {

    }

    _actionDelete(context) {

    }
}

module.exports = DefaultController;