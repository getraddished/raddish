var BaseLoader      = require('./loader/loader');
var BaseIdentifier  = require('./identifier/identifier');
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
                return self._setStream(Obj);
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

                reject(error);
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
    var stream = undefined;
    var self = this;

    return new Promise(function(resolve, reject) {
        if(self._getType(Obj) !== undefined) {
            switch (self._getType(Obj)) {
                case 'readable':
                    stream = Stream.Readable;
                    break;
                case 'writable':
                    stream = Stream.Writable;
                    break;
                case 'transformable':
                    stream = Stream.Transform;
                    break;
            }

            // Continue with object binding.
            if(!Obj.prototype) {
                Obj.prototype = {};
            }

            for(var index in stream.prototype) {
                Obj.prototype[index] = stream.prototype[index];
            }

            self._setBaseSuper(Obj, stream);
            resolve(new Obj());
        } else {
            self._setBaseSuper(Obj, undefined);
            resolve(new Obj());
        }
    });
};

/**
 * Get the type of a specified object. The types are set in the Base Objects (Controller, Dispatcher, etc.)
 *
 * @method _getType
 * @param {Object} Obj The object to examine.
 * @returns {String} Type of the object (readable, writable, transform)
 * @private
 */
Base.prototype._getType = function(Obj) {
    var level = 0;
    var obj = Obj;

    while(!obj.type && level < 2) {
        if(!obj.super_) {
            break;
        }
        obj = obj.super_;
        level++;
    }

    return obj.type;
};

/**
 * Set the super_ of the Base object.
 *
 * @method _setBaseSuper
 * @param {Object} Obj The object to set the base super_ of.
 * @param {Object} Super The super Object to set.
 * @private
 */
Base.prototype._setBaseSuper = function(Obj, Super) {
    var obj = Obj;

    while(obj.super_.name != 'Base') {
        obj = obj.super_;
    }

    obj.super_.super_ = Super;
};

module.exports = Base;