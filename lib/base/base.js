var BaseLoader      = require('./loader/loader');
var BaseIdentifier  = require('./identifier/identifier');
var Config          = require(process.cwd() + '/config.js');
var CommandChain    = require('./chain/chain');
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
    Base.super_.apply(this, arguments);
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
    return Config[key];
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
 * @method getObject
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
            .then(function (Obj) {
                // Hmm, we might be able to extend here.
                // Because we have the constructor here and not an already initialized object.
                return Obj;
            })
            .then(function (obj) {
                config.identifier = orgIdentifier;
                return obj.initialize(config);
            })
            .then(function (obj) {
                resolve(obj);
            })
            .catch(function(error) {
                console.log(error);
            });
    });
};

/**
 * This function will set the appropriate stream for the object,
 * If there is no streamtype found it will return the object like normal
 * Beyond this point nothing strange will happen.
 *
 * @method _setStream
 * @param Obj The object which is going to get inherited with a stream
 * @returns {Object} The object with the stream infused.
 * @private
 */
Base.prototype._setStream = function(Obj) {
    // Getting the stream type (if any)
    if(Obj.type) {
        switch (Obj.type) {
            case 'readable':
                util.inherits(Obj, Stream.Readable);
                break;
            case 'writable':
                util.inherits(Obj, Stream.Writable);
                break;
            case 'transformable':
                util.inherits(Obj, Stream.Transform);
                break;
        }
    }

    return Obj;
};

module.exports = Base;