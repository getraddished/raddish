'use strict';

var AbstractController = require('./abstract');

class DefaultController extends AbstractController {
    _actionGet(context) {
        var self = this;

        return this.getModel()
            .then(function(model) {
                var state = model.state,
                    method = state.isUnique() ? 'read' : 'browse';

                return self.execute(method, context);
            });
    }

    _actionBrowse(context) {
        return this.getModel()
            .then(function(model) {
                return model.getList();
            });
    }

    _actionRead(context) {
        return this.getModel()
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

    _actionDelete(context) {

    }
}

module.exports = DefaultController;