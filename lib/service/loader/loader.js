"use strict";

/**
 * This is a complete loader for objects.
 * This will be handeling the identifiers as well.
 */

// The cache placeholder.
// This is a variable which will be used by all the instances.
var cache = {};
var clone = require('clone');
var Raddish = require('../../raddish/raddish');
var ServiceIdentifier = require('../identifier/identifier');

/**
 * BaseLoader object which handles all the loading of the requested objects.
 *
 * @class BaseLoader
 * @since 28 March 2014
 * @constructor
 */
function BaseLoader() {
    this.sequence = [];

    // We have a default fallback.
    if(Raddish.getConfig('loader.sequence')) {
        this.sequence = Raddish.getConfig('loader.sequence');
    } else {
        this.sequence = [
            '<App>:<Component>.<Path>.default',
            '<App>:default.<Path>.<Name>',
            '<App>:default.<Path>.default',
            'core:<Path>.<Name>',
            'core:<Path>.<Type>',
        ];
    }
}

/**
 * The load function will check if the object has been cached.
 * If this is not the case it will try to resolve the object.
 *
 * When an object has been loaded for the first time it is cached for reuse in a later request.
 *
 * @method load
 * @param {String} identifier The identifier of the object to be loaded
 * @return {Promise} This will hold the uninitialized object.
 */
BaseLoader.prototype.load = function (identifier, config) {
    var self = this;
    var orgIdentifier = identifier.clone();

    if (cache[orgIdentifier.toString()]) {
        // The object has been cached, good, now return it.
        var obj = clone(cache[orgIdentifier.toString()], false, 4);

        return Promise.resolve(obj);
    } else {
        // No cache found, resolve it and cache it.
        return self.resolve(identifier)
            .then(function (Obj) {
                var obj = new Obj({
                    identifier: orgIdentifier
                });

                return obj.initialize(config)
            })
            .then(function(object) {
                if(object.cache != false && Raddish.getConfig('cache')) {
                    cache[orgIdentifier.toString()] = object;
                }

                return clone(object, false, 4);
            });
    }
};

/**
 * Load a specific object.
 * By default it will be checking in the applications folder.
 *
 * @method resolve
 * @param {String} identifier The identifier of the object which needs to be resolved.
 * @param {Function} callback The callback function to be called when the object is resolved.
 */
BaseLoader.prototype.resolve = function (identifier, callback) {
    var self = this;
    var name = identifier.getName();

    return Promise.cast(this.sequence)
        .then(function(sequence) {
            var object = undefined;

            for(var index in sequence) {
                var ident = self.parseSequence(sequence[index], identifier);

                object = self.receive(ident.getFilePath());
                if(object !== false) {
                    return object;
                }
            }

            return false;
        });
};

BaseLoader.prototype.parseSequence = function(string, identifier) {
    string = string.replace('<App>', identifier.getApplication());
    string = string.replace('<Component>', identifier.getComponent());
    string = string.replace('<Path>', identifier.getPath().join('.'));
    string = string.replace('<Name>', identifier.getName());
    string = string.replace('<Type>', identifier.getType());

    return new ServiceIdentifier(string);
};

/**
 * Receive function which tries to return the requested file.
 *
 * @method receive
 * @param {String} path The path to the filename.
 * @returns {Object|false} Result of the call when the file isn't found it will return false.
 */
BaseLoader.prototype.receive = function (path) {
    try {
        return require(path);
    } catch (Error) {
        return false;
    }
};

module.exports = new BaseLoader();