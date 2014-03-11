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
Base.prototype.initialize = function(config, callback) {
    // Setting the identifier of the object.
    // This function will be used a lot.
    if(!(config.identifier instanceof BaseIdentifier)) {
        this.identifier = new BaseIdentifier(config.identifier);
    } else {
        this.identifier = config.identifier;
    }

    callback(null);
};

Base.prototype.getConfig = function(key) {
    return Config[key];
};

Base.prototype.getIdentifier = function() {
    return this.identifier;
};

Base.prototype.getCommandChain = function(callback) {
    new CommandChain(this, function(chain) {
        callback(chain);
    });
};

Base.prototype.getObject = function(identifier, config, callback) {
    var self = this;
    if(config === null) {
        config = {};
    }
    
    if(!(identifier instanceof BaseIdentifier)) {
        identifier = new BaseIdentifier(identifier);
    }

    var orgIdentifier = identifier.clone();
    
    BaseLoader.load(identifier, function(Obj) {
        // Set the original identifier.
        config.identifier = orgIdentifier;

        var obj = new Obj();
        obj.initialize(config, function(done) {
            callback(obj);
        });
    });
};

module.exports = Base;