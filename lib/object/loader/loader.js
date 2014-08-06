"use strict";

/**
 * This is a complete loader for objects.
 * This will be handeling the identifiers as well.
 */

// The cache placeholder.
// This is a variable which will be used by all the instances.
var cache               = {};
var clone               = require('clone');
var Raddish             = require('../../raddish/raddish');
var ObjectIdentifier   = require('../identifier/identifier');
var locators            = {};

/**
 * ObjectLoader object which handles all the loading of the requested objects.
 *
 * @class ObjectLoader
 * @since 28 March 2014
 * @constructor
 */
function ObjectLoader() {
    this.sequence = undefined;

    this.addLocator('../locator/core');
    this.addLocator('../locator/component');
}

/**
 * Add a locator for a specific type.
 *
 * @param {String} path The path to the locator.
 */
ObjectLoader.prototype.addLocator = function (path) {
    var locator = new (require(path))();

    locators[locator._type] = locator;
};

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
ObjectLoader.prototype.load = function (identifier, config) {
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
                if(typeof Obj === 'boolean') {
                    throw new RaddishError(500, 'Identifier "' + identifier.toString() + '" is not a correct resource identifier');
                }
                
                var obj = new Obj({
                    identifier: orgIdentifier
                });

                return (typeof obj.initialize === 'function') ? obj.initialize(config) : obj;
            })
            .then(function(object) {
                if(object.cache !== false && Raddish.getConfig('cache')) {
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
ObjectLoader.prototype.resolve = function (identifier) {
    var self = this;
    
    return Promise.cast(this.getSequence())
        .then(function(sequence) {
            for(var index in sequence) {
                var ident = self.parseSequence(sequence[index], identifier);

                var object = self.receive(ident);
                if(object !== false) {
                    return object;
                }
            }

            return false;
        });
};

ObjectLoader.prototype.parseSequence = function(string, identifier) {
    string = string.replace('<Type>', identifier.getType());
    string = string.replace('<App>', identifier.getApplication());
    string = string.replace('<Package>', identifier.getPackage());
    string = string.replace('<Path>', identifier.getPath().join('.'));
    string = string.replace('<Name>', identifier.getName());

    return new ObjectIdentifier(string);
};

ObjectLoader.prototype.getSequence = function() {
    if(this.sequence) {
        return this.sequence;
    } else {
        if(Raddish.getConfig('loader.sequence')) {
            this.sequence = Raddish.getConfig('loader.sequence');
        } else {
            this.sequence = [
                '<Type>://<App>/<Package>.<Path>.<Name>',
                '<Type>://<App>/<Package>.<Path>.default',
                '<Type>://<App>/default.<Path>.<Name>',
                '<Type>://<App>/default.<Path>.default',
                'core:<Package>.<Path>.<Name>',
                'core:<Package>.<Path>.default',
                'core:<Path>.<Name>',
                'core:<Path>.default'
            ];
        }

        return this.sequence;
    }
};

/**
 * Receive function which tries to return the requested file.
 *
 * @method receive
 * @param {String} path The path to the filename.
 * @returns {Object|false} Result of the call when the file isn't found it will return false.
 */
ObjectLoader.prototype.receive = function (identifier) {
    return locators[identifier.getType()].locate(identifier);
};

module.exports = new ObjectLoader();