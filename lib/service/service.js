"use strict";

var ServiceLoader       = require('./loader/loader');
var ServiceIdentifier   = require('./identifier/identifier');
var CommandChain        = require('../command/chain/chain');
var util                = require('util');
var Stream              = require('stream');
var Mixin               = require('../mixin/mixin.js');
var configs             = {};
var fs                  = require('fs');

/**
 * Service class for inheritance and base functions
 *
 * @class Service
 * @since 28 March 2014
 * @constructor
 */
function Service(config) {
    if (!(config.identifier instanceof ServiceIdentifier)) {
        this.identifier = new ServiceIdentifier(config.identifier);
    } else {
        this.identifier = config.identifier;
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
    return ServiceLoader.load(identifier, config);
};

/**
 * This is the handler which will try to mixin functions from another object.
 * @param object
 */
Service.prototype.mixin = function(object) {
    Mixin.mix(this, object);
};

/**
 * This function will check if there is a config for an component, if so it will return the requested key.
 * If no config is found it will return false. When there is no identifier for the component (in initialize functions) please use the identifier value.
 *
 * The key is dot separated.
 *
 * @param {String} identifier The key of the identifier, only used in initialize functions.
 * @param {String} config Key to resceive of the config.
 * @returns {*} The found config item.
 */
Service.prototype.getComponentConfig = function(key) {
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

        var file = app.config.component + '/' + this.getIdentifier().getPackage() + '/config.json';
        var backup = app.config.config ? app.config.config + '/' + this.getIdentifier().getPackage() + '/config.json' : false;

        if(fs.existsSync(file)) {
            config = JSON.parse(fs.readFileSync(file));
        } else if(backup && fs.existsSync(backup)) {
            config = JSON.parse(fs.readFileSync(backup));
        }

        configs[identifier] = config;
    }

    var config = configs[identifier];
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
    if(typeof base == 'object') {
        base = JSON.parse(JSON.stringify(base));
    }

    return base;
};

/**
 * This function will get the requested plugin(s).
 * The plugins are for a global system. Because the affect system behaviors.
 *
 * When the type has a "." in the name it is split.
 * First we will check if the single plugin exists which is path ( + name ) + name.
 * if this file doesn't exist then we will check all the files in the directory. (if it is a directory).
 *
 * then we will return everything (file or array).
 */
Service.prototype.getPlugins = function(type) {
    var plugins = [];
    var path    = [];
    var name    = '';

    // If there is a dot in the type, I have to check if there is a file located with the last part of the type.
    // If there isn't we have subdirectories. And we will return everything.
    // This will rely on fs and require.
    if(type.indexOf('.') > -1) {
        path = type.split('.');
        name = path[path.length - 1];
    } else {
        name = type;
    }

    var dir  = process.cwd() + '/plugins/' + path.join('/') + name;
    try {
        var Obj = require(dir + '/' + name);
        plugins.push(new Obj());
    } catch(error) {
        try {
            var files = fs.readdirSync(dir);

            for(var index in files) {
                var name = files[index];
                var file = fs.statSync(dir + '/' + files[index]);

                if(file.isDirectory()) {
                    try {
                        var Obj = require(dir + '/' + name + '/' + name);
                        plugins.push(new Obj());
                    } catch(error) {}
                }
            }
        } catch(error) {}
    }

    return plugins;
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
};

module.exports = Service;