'use strict';

var ObjectManger = require('../object/manager'),
    Inflector = require('raddish-inflector');

class AbstractController extends ObjectManger {
    constructor(config) {
        super(config);

        this.format = '';
        this.model = '';
    }

    _initialize(config) {
        this.format = config.format || Inflector.singularize(this.getIdentifier().getPackage());
        this.model = config.model || '';

        return super._initialize(config);
    }

    getModel() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['model']);

        return this.getObject(identifier);
    }

    getView() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['view']);

        return this.getObject(identifier);
    }

    /**
     * This method will return the permissions object belonging to the current controller.
     *
     * @returns {DefaultPermission} The permissions object.
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
     * @param {String} method The method to execute
     * @param {CommandContext} context The context for the method.
     */
    execute(method, context) {
        var sup = super.execute,
            self = this;

        return this.getPermissions()
            .then(function(permissions) {
                var permission = 'can' + Inflector.capitalize(method);

                return permissions[permission](context);
            })
            .then(function(hasAbility) {
                if(hasAbility) {
                    return sup.call(self, method, context);
                }

                context.response.statusCode = 401;
                throw new Error('Unauthorized!');
            });
    }
}

module.exports = AbstractController;