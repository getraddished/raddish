'use strict';

var ObjectManager = require('../object/manager'),
    Inflector = require('raddish-inflector'),
    Raddish = require('../raddish/raddish').getInstance();

class AbstractDispatcher extends ObjectManager {
    constructor(config) {
        super(config);

        this.authenticator = 'basic';
    }

    /**
     * The _initialize method initializes the dispatcher, this method will set the default controller which is being requested.
     *
     * @param config
     * @returns {*}
     * @private
     */
    _initialize(config) {
        config.controller = config.controller || Inflector.singularize(this.getIdentifier().getPackage());

        this.authenticator = config.authenticator || this.authenticator;

        return super._initialize(config);
    }

    getAuthenticator() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['dispatcher', 'authenticator'])
            .setName(this.authenticator);

        return this.getObject(identifier);
    }

    getController(view, format) {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['controller'])
            .setName(view);

        return this.getObject(identifier, {
            format: format
        });
    }

    _actionDispatch(context) {
        var view = context.request.query.view || Inflector.pluralize(this.config.controller),
            format = context.request.query.format || Raddish.getConfig('format'),
            self = this;

        return this.getAuthenticator()
            .then(function(authenticator) {
                return authenticator.authenticate(context.request);
            })
            .then(function(user) {
                context.user = user;

                return self.getController(view, format)
            })
            .then(function(controller) {
                return controller.execute(context.method, context);
            })
            .then(function(result) {
                return context.response.end(result);
            });
    }
}

module.exports = AbstractDispatcher;