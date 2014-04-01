var BaseLoader      = require('./loader/loader');
var BaseIdentifier  = require('./identifier/identifier');
var Config          = require(process.cwd() + '/config.js');
var CommandChain    = require('./chain/chain');

/**
 * Base class for inheritance and base functions
 *
 * @class Base
 * @since 28 March 2014
 * @constructor
 */
function Base() {

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
                return new Obj();
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

module.exports = Base;