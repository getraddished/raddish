'use strict';

var ObjectManager = require('../object/manager'),
    Inflector = require('inflected'),
    Raddish = require('../raddish/raddish').getInstance();

/**
 * The AbstractDispatcher class holds all the basic methods of the dispatcher.
 *
 * @class AbstractDispatcher
 * @extends ObjectManager
 */
class AbstractDispatcher extends ObjectManager {
    constructor(config) {
        super(config);

        this.authenticator = 'basic';
    }

    /**
     * The _initialize method initializes the dispatcher, this method will set the default controller which is being requested.
     *
     * @method _initialize
     * @param config
     * @returns {Promise} A promise contianing the initialised object.
     * @private
     */
    _initialize(config) {
        config.controller = config.controller || Inflector.singularize(this.getIdentifier().getPackage());

        return super._initialize(config);
    }

    /**
     * This method returns the controller that is related to the dispatcher and the view you have requested.
     *
     * @method getView
     * @param {String} view The requested view.
     * @param {String} format The requested format.
     * @return {Promise} A promise containing the requested controller.
     */
    getController(view, format) {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['controller'])
            .setName(view);

        return this.getObject(identifier, {
            format: format
        });
    }

    /**
     * The _actionDispatch will check the view, if it is located in the query it will use that one,
     * else the plural name of the config is used.
     *
     * Also a check on the format is done, if not found the default format is used specified in the config.json file.
     *
     * After all this the request is authenticated, and executed.
     *
     * @method _actionDispatch
     * @param {CommandContext} context The context of the request.
     * @return {Promise} A promise containing the closed request object.
     * @private
     */
    _actionDispatch(context) {
        var view = context.request.query.view || Inflector.pluralize(this.config.controller),
            format = context.request.query.format || Raddish.getConfig('format');

        return this.getController(view, format)
            .then(function(controller) {
                return controller.execute(context.method, context);
            });
    }
}

module.exports = AbstractDispatcher;