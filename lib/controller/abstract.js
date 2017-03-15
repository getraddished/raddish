'use strict';

var ObjectManger = require('../object/manager'),
    Inflector = require('raddish-inflector'),
    Raddish = require('../raddish/raddish').getInstance();

/**
 * The AbstractController will hold the basic information for the controller,
 * this class doesn't have any basic functionality for the requests.
 *
 * @class AbstractController
 */
class AbstractController extends ObjectManger {
    constructor(config) {
        super(config);

        this.format = '';
        this.model = '';
    }

    _initialize(config) {
        this.format = config.format || Raddish.getConfig('format') || 'json';
        this.model = config.model || '';

        return super._initialize(config);
    }

    /**
     * This method will return the requested model,
     * the retreival of the model respects the fallback system.
     *
     * @method getModel
     * @param {Object} state The state to set on the model
     * @return {Promise} A promise containing the model.
     */
    getModel(state) {
        var self = this,
            identifier = this.getIdentifier()
                .clone()
                .setPath(['model']);

        if(this.related['model']) {
            return Promise.resolve(this.related.model);
        }

        return this.getObject(identifier)
            .then(function(model) {
                if(state) {
                    model.setState(state);
                }

                self.related.model = model;
                return model;
            });
    }

    /**
     * This method will return the requested view,
     * the retreival of the view respects the fallback system.
     *
     * @method getView
     * @return {Promise} A promise containing the view.
     */
    getView() {
        var self = this,
            identifier = this.getIdentifier()
                .clone()
                .setPath(['view'])
                .setName(this.format);

        if(this.related['view']) {
            return Promise.resolve(this.related.view);
        }

        return this.getObject(identifier)
            .then(function(view) {
                self.related.view = view;

                return view;
            });
    }

    /**
     * This method will return the permissions object belonging to the current controller.
     *
     * @method getPermissions
     * @returns {Promise} A promise containing the permissions.
     */
    getPermissions() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['controller', 'permission']);

        return this.getObject(identifier);
    }

    /**
     * This is an extension on the global execute method.
     * This method will check if the current user is able to do the action,
     * and thus will check the permissions file for the current controller.
     *
     * @method execute
     * @param {String} method The method to execute
     * @param {CommandContext} context The context for the method.
     * @return {Promise} A promise containing result of the method call.
     */
    execute(method, context) {
        var sup = super.execute;

        return this.getPermissions()
            .then(function(permissions) {
                var permission = 'can' + Inflector.capitalize(method);

                return permissions[permission](context);
            })
            .then(function(hasAbility) {
                if(hasAbility) {
                    return sup.call(this, method, context);
                }

                context.response.statusCode = 401;
                throw new Error('Unauthorized!');
            }.bind(this));
    }
}

module.exports = AbstractController;