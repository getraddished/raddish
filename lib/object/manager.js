"use strict";

var ObjectLoader        = require('./loader/loader');
var ObjectIdentifier    = require('./identifier/identifier');
var clone               = require('clone');
var CommandChain        = require('../command/chain/chain');
var Mixin               = require('../mixin/mixin.js');
var configs             = {};
var fs                  = require('fs');
var Stream              = require('stream');

/**
 * ObjectManager class for inheritance and base functions
 *
 * @class ObjectManager
 * @constructor
 */
function ObjectManager(config) {
    if (!(config.identifier instanceof ObjectIdentifier)) {
        this.identifier = new ObjectIdentifier(config.identifier);
    } else {
        this.identifier = config.identifier;
    }

    // Check if streaming is enabled, if so check the type and bind the correct stream.
    if(Raddish.getConfig('stream') && this._type) {
        var Parent = {};
        var opts = this._opts || {};

        // We will bind everything to this.
        switch(this._type) {
            case 'read':
                Parent = Stream.Readable;
                break;
            case 'transform':
                Parent = Stream.Transform;
                break;
            case 'write':
                Parent = Stream.Writable;
                break;
        }

        var parent = new Parent(opts);

        // Mix all the stream properties.
        for(var index in parent) {
            if(!this[index]) {
                this[index] = parent[index];
            }
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
ObjectManager.prototype.initialize = function (config) {
    if (config.behaviors) {
        this.behaviors = config.behaviors;
        this.commandchain = new CommandChain(this);
    }

    return Promise.resolve(this);
};

/**
 * Use this function to acquire a variable from config.js
 *
 * @method getConfig
 * @param {String} key Key to specify the config to return
 * @returns {*} The requested config value.
 */
ObjectManager.prototype.getConfig = function (key) {
    return Raddish.getConfig(key);
};

/**
 * Use this function to acquire the identifier object
 *
 * @method getIdentifier
 * @returns {RObjectdentifier} Identifier object.
 */
ObjectManager.prototype.getIdentifier = function () {
    return this.identifier;
};

/**
 * Return the command chain to run behaviors.
 *
 * @method getCommandChain
 * @returns {CommandChain} CommandChain object.
 */
ObjectManager.prototype.getCommandChain = function () {
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
ObjectManager.prototype.getObject = function (identifier, config) {
    if (config === null || !config) {
        config = {};
    }

    if (!(identifier instanceof ObjectIdentifier)) {
        identifier = new ObjectIdentifier(identifier);
    }

    return ObjectLoader.load(identifier, config);
};

/**
 * This function will be available for every object,
 * this will clone the current object.
 *
 * @method clone
 * @returns {Object} An exact copy of the current object
 */
ObjectManager.prototype.clone = function() {
    return clone(this, false, 4);
};

/**
 * This is the handler which will try to mixin functions from another object.
 *
 * @method mixin
 * @param {Object} object The object to mix into the current object.
 */
ObjectManager.prototype.mixin = function(object) {
    // Make this a little more convinient.
    // If there is a function try to create an object out of it.
    if(typeof object == 'function') {
        object = new object();
    }

    Mixin.mix(this, object);
};

/**
 * This method will check if there is a config for an component, if so it will return the requested key.
 * If no config is found it will return false. When there is no identifier for the component (in initialize functions) please use the identifier value.
 *
 * The key is dot separated.
 *
 * @param {String} identifier The key of the identifier, only used in initialize functions.
 * @param {String} config Key to resceive of the config.
 * @returns {*} The found config item.
 */
ObjectManager.prototype.getComponentConfig = function(key) {
    var identifier = this.getIdentifier().getApplication() + ':' + this.getIdentifier().getPackage();
    var Application = require('../application/application');
    var config = {};

    // Load the config file and cache it.
    if(!configs[identifier] ) {
        // Load the config file.
        var app = Application.getApplication(this.getIdentifier().getApplication());
        if(!app) {
            return false;
        }

        var component = app.config.component + '/' + this.getIdentifier().getPackage() + '/config.json';
        var application = app.config.config ? app.config.config + '/' + this.getIdentifier().getPackage() + '.json' : false;

        try {
            config = require(component);
        } catch(Exception) {
            config = {};
        }

        try {
            application = require(application);

            extendConfig(config, application);
        } catch(Exception) {}

        configs[identifier] = config;
    }

    config = configs[identifier];
    var parts = key.split('.');

    var base = config;
    for(var index in parts) {
        if(base[parts[index]]) {
            base = base[parts[index]];
        } else {
            return false;
        }
    }

    // We have to send a copy or else it will be changed.
    if(typeof base === 'object') {
        base = JSON.parse(JSON.stringify(base));
    }

    return base;
};

/**
 * This is a alias of ObjectManager.getObject to use in the "this" context.
 *
 * @method getObject
 * @param {String} identifier Identifier of the object to load
 * @param {Object|null} config Config to push to the object
 * @returns {Promise} call ".then" to use the object when ready.
 */
ObjectManager.get = function(identifier, config) {
    return ObjectManager.prototype.getObject(identifier, config);
};

/**
 * This is a private function to allow for config extending
 *
 * @private
 */
 function extendConfig(target, source) {
    for(var index in source) {
        // When the index doesn't exist in the target copy everything.
        if(!target[index]) {
            target[index] = source[index];
        } else {
            // Check the type.
            if(typeof source[index].join === 'function' || typeof source[index] === 'string' || typeof source[index] === 'number') {
                target[index] = source[index];
            } else {
                extendConfig(target[index], source[index]);
            }
        }
    }
}

module.exports = ObjectManager;