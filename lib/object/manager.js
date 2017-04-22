'use strict';

var Loader = require('raddish-loader').Loader.getInstance(),
    Identifier = require('raddish-loader').Identifier,
    Application = require('../application/application'),
    Inflector = require('inflected'),
    CommandChain = require('../command/chain');

/**
 * The ObjectManager class is the basic class of all the files in Raddish,
 * if the object you have created has the method getObject it extends from this class.
 *
 * @class ObjectManager
 */
class ObjectManager {
    constructor(config) {
        this.config = {};
        this.identifier = config.identifier;
        this.commandChain = null;

        // Related object cache.
        this.related = {};
    }

    /**
     * The abstract initialize method sets the config,
     * and when behaviors are added it will allocate them.
     *
     * @method _initialize
     * @param {Object} config the config for this object
     * @return {Promise} A promise containing the initialized object.
     * @private
     */
    _initialize(config) {
        this.config = config;
        this.commandChain = new CommandChain(this, config.behaviors);

        return Promise.resolve(this);
    }

    /**
     * The getIdentifier method will return the identifier for the current object.
     *
     * @method getIdentifier
     * @return {Identifier} The identifier object from Raddish-Loader
     */
    getIdentifier() {
        return this.identifier;
    }

    /**
     * The getCommandChain will return the command chain for the current object.
     *
     * @method getCommandChain
     * @return {CommandChain} The command chain object.
     */
    getCommandChain() {
        return this.commandChain;
    }

    /**
     * The clone method will return a clone of the current object.
     * The clone is going exactly 4 levels deep.
     *
     * @method clone
     * @return {Object} The cloned object.
     */
    clone() {
        return this.getObject(this.getIdentifier(), this.config);
    }

    /**
     * The execute method executes a method against the command chain.
     *
     * @method execute
     * @param method The method to execute
     * @param context A simple object to act as the basic context.
     * @return {Promise} A promise containing the context with the result of the call.
     */
    execute(method, context) {
        var chain = this.getCommandChain(),
            self = this;

        return chain.execute('initialize.' + method, context)
            .then(function() {
                return chain.execute('before.' + method, context);
            })
            .then(function() {
                return self['_action' + Inflector.capitalize(method)](context)
                    .then(function(result) {
                        context.result = result;
                        return self.getCommandChain();
                    });
            })
            .then(function(chain) {
                return chain.execute('after.' + method, context);
            })
            .then(function() {
                return context.result;
            });
    }

    /**
     * The getObject method will try to load the specified identifier.
     * An optional config can be given for the identifier to load.
     *
     * @method getObject
     * @param {String|Identifier} identifier An identifier string/ object.
     * @param {Object} config An optional config object.
     * @return {Promise} A promise containing the initialized object.
     */
    getObject(identifier, config) {
        config = config || {};

        var Obj = Loader.require(identifier),
            object = new Obj({
                identifier: new Identifier(identifier)
            });

        config = this._getComponentConfig(identifier, config);
        return (typeof object['_initialize'] == 'function' ? object._initialize(config) : Promise.resolve(object));
    }

    isValidIdentifier(identifier) {
        try {
            new Identifier(identifier);
            return true;
        } catch(err) {
            return false;
        }
    }

    /**
     * The _getComponentConfig is an internal method to combine all the config object together.
     * Usually you don't have to call this method manually.
     *
     * @method _getComponentConfig
     * @param {Identifier} identifier The identifier object of the object to load.
     * @param {Object} config The config object for the object to load.
     * @return {Object} The complete and combined config object.
     * @private
     */
    _getComponentConfig(identifier, config) {
        var ident = new Identifier(identifier),
            conf = Application.findApplication(ident.getApplication())._getComponentConfig(ident.getPackage()),
            path = ident.getPath().concat(ident.getName());

        conf = path.reduce(function(config, index) {
            return config[index] || {};
        }, conf);

        return Object.assign(conf, config);
    }

    /**
     * The get method on the ObjectManager class will load an object.
     * This is a static alias of the getObject method.
     *
     * @method get
     * @static
     * @param {String|Identifier} identifier An identifier string/ object.
     * @param {Object} config An optional config object.
     * @return {Promise} A promise containing the initialized object.
     */
    static get() {
        return ObjectManager.prototype.getObject.apply(ObjectManager.prototype, arguments);
    }
}

module.exports = ObjectManager;