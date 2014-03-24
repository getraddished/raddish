/**
 * This will be the base class.
 * All the other classes will extend from this class.
 *
 * The class will have the following functions:
 * - Inheritance:
 *      The class can do dynamic inheritance, this implies that the classes when specified a type
 *      can have completely different parents. But classes can also extend from this class without a specific type.
 *      The type that is given will determine the stream.
 *
 * - Config
 *      This class can return config values.
 * 
 * - Object
 *      Return the objects that are requested.
 */

var util                = require('util');
var stream              = require('stream');
var BaseLoader          = require('./loader/loader');
var BaseIdentifier      = require('./identifier/identifier');
var Config              = require(process.cwd() + '/config.js');
var CommandChain        = require('./chain/chain');

function Base() {

}

/**
 * This is a nonblocking function, So all the functions called in here will be loaded on the fly, which might give issues later on.
 * I will keep things in mind.
 */
Base.prototype.initialize = function(config) {
    var self = this;

    return new Promise(function(resolve, reject) {
        if(!(config.identifier instanceof BaseIdentifier)) {
            self.identifier = new BaseIdentifier(config.identifier);
        } else {
            self.identifier = config.identifier;
        }

        if(config.behaviors) {
            self.behaviors = config.behaviors;
            self.commandchain = new CommandChain(self);
        }

        resolve(self);
    });
};

Base.prototype.getConfig = function(key) {
    return Config[key];
};

Base.prototype.getIdentifier = function() {
    return this.identifier;
};

Base.prototype.getCommandChain = function() {
    return this.commandchain;
};

Base.prototype.getObject = function(identifier, config) {
    var self = this;

    if(config === null) {
        config = {};
    }
    
    if(!(identifier instanceof BaseIdentifier)) {
        identifier = new BaseIdentifier(identifier);
    }

    var orgIdentifier = identifier.clone();

    return new Promise(function(resolve, reject) {
        BaseLoader.load(identifier)
            .then(function(Obj) {
                console.log(Obj);
                return new Obj();
            })
            .then(function(obj) {
                config.identifier = orgIdentifier;
                return obj.initialize(config);
            })
            .then(function(obj) {
                resolve(obj);
            });
    });
};

module.exports = Base;