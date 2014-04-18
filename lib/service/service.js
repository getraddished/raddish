var BaseLoader      = require('./loader/loader');
var BaseIdentifier  = require('./identifier/identifier');
var CommandChain    = require('../command/chain/chain');
var util            = require('util');
var Stream          = require('stream');

/**
 * Base class for inheritance and base functions
 *
 * @class Base
 * @since 28 March 2014
 * @constructor
 */
function Base() {
    if(Base.super_) {
        var parent = Base.super_.apply(this, {});

        for(var index in parent) {
            this[index] = parent[index];
        }
    }
}

/**
 * Every object called through getObject will go through this function.
 * This will set the identifier and adds the behaviors (if any).
 *
 * @method initialize
 * @param {Object} config Object with config values
 * @returns {Promise} call ".then" to use the object when ready.
 */
Base.prototype.initialize = function (config) {
    var self = this;

    return new Promise(function (resolve, reject) {
        if (!(config.identifier instanceof BaseIdentifier)) {
            self.identifier = new BaseIdentifier(config.identifier);
        } else {
            self.identifier = config.identifier;
        }

        if (config.behaviors) {
            self.behaviors = config.behaviors;
            self.commandchain = new CommandChain(self);
        }

        resolve(self);
    });
};

/**
 * Use this function to acquire a variable from config.js
 *
 * @method getConfig
 * @param {String} key Key to specify the config to return
 * @returns {*} The requested config value.
 */
Base.prototype.getConfig = function (key) {
    var raddish = require('../raddish/raddish');

    return raddish.getConfig(key);
};

/**
 * Use this function to acquire the identifier object
 *
 * @method getIdentifier
 * @returns {BaseIdentifier} Identifier object.
 */
Base.prototype.getIdentifier = function () {
    return this.identifier;
};

/**
 * Return the command chain to run behaviors.
 *
 * @method getCommandChain
 * @returns {CommandChain} CommandChain object.
 */
Base.prototype.getCommandChain = function () {
    return this.commandchain;
};

/**
 * Acquire an initialized object.
 * You can request all kinds of objects with this function
 *
 * @param {String} identifier Identifier of the object to load
 * @param {Object|null} config Config to push to the object
 * @returns {Promise} call ".then" to use the object when ready.
 */
Base.prototype.getObject = function (identifier, config) {
    var self = this;

    if (config === null || !config) {
        config = {};
    }

    if (!(identifier instanceof BaseIdentifier)) {
        identifier = new BaseIdentifier(identifier);
    }

    var orgIdentifier = identifier.clone();

    return new Promise(function (resolve, reject) {
        BaseLoader.load(identifier)
            .then(function returnNewObject(Obj) {
                // Hmm, we might be able to extend here.
                // Because we have the constructor here and not an already initialized object.
                return new Obj();
            })
            .then(function returnInitializedObject(obj) {
                config.identifier = orgIdentifier;
                return obj.initialize(config);
            })
            .then(function returnObject(obj) {
                resolve(obj);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

/**
 * This is a alias of Base.getObject to use in the "this" context.
 *
 * @method getObject
 * @param {String} identifier Identifier of the object to load
 * @param {Object|null} config Config to push to the object
 * @returns {Promise} call ".then" to use the object when ready.
 */
Base.getObject = function(identifier, config) {
    return Base.prototype.getObject(identifier, config);
}

module.exports = Base;