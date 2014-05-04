var ServiceLoader      = require('./loader/loader');
var ServiceIdentifier  = require('./identifier/identifier');
var CommandChain    = require('../command/chain/chain');
var util            = require('util');
var Stream          = require('stream');

/**
 * Service class for inheritance and base functions
 *
 * @class Service
 * @since 28 March 2014
 * @constructor
 */
function Service() {
    if(Service.super_) {
        var parent = Service.super_.apply(this, {});

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
Service.prototype.initialize = function (config) {
    var self = this;

    return new Promise(function (resolve, reject) {
        if (!(config.identifier instanceof ServiceIdentifier)) {
            self.identifier = new ServiceIdentifier(config.identifier);
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
Service.prototype.getConfig = function (key) {
    return Raddish.getConfig(key);
};

/**
 * Use this function to acquire the identifier object
 *
 * @method getIdentifier
 * @returns {ServiceIdentifier} Identifier object.
 */
Service.prototype.getIdentifier = function () {
    return this.identifier;
};

/**
 * Return the command chain to run behaviors.
 *
 * @method getCommandChain
 * @returns {CommandChain} CommandChain object.
 */
Service.prototype.getCommandChain = function () {
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
Service.prototype.getService = function (identifier, config) {
    var self = this;

    if (config === null || !config) {
        config = {};
    }

    if (!(identifier instanceof ServiceIdentifier)) {
        identifier = new ServiceIdentifier(identifier);
    }

    var orgIdentifier = identifier.clone();

    return new Promise(function (resolve, reject) {
        ServiceLoader.load(identifier)
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
 * This is a alias of Service.getObject to use in the "this" context.
 *
 * @method getService
 * @param {String} identifier Identifier of the object to load
 * @param {Object|null} config Config to push to the object
 * @returns {Promise} call ".then" to use the object when ready.
 */
Service.get = function(identifier, config) {
    return Service.prototype.getService(identifier, config);
}

module.exports = Service;