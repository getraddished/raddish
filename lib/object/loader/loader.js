"use strict";

/**
 * This is a complete loader for objects.
 * This will be handeling the identifiers as well.
 */

// The cache placeholder.
// This is a variable which will be used by all the instances.
var cache               = {},
    Raddish             = require('../../raddish/raddish'),
    ObjectIdentifier    = require('../identifier/identifier'),
    locators            = {};

/**
 * ObjectLoader object which handles all the loading of the requested objects.
 *
 * @class ObjectLoader
 * @constructor
 */
function ObjectLoader() {
    this.sequence = undefined;
}

/**
 * Load a specific object.
 * By default it will be checking in the applications folder.
 *
 * @method resolve
 * @param {String} identifier The identifier of the object which needs to be resolved.
 */
ObjectLoader.prototype.resolve = function (identifier) {
    var sequence = this.getSequence();

    for(var index in sequence) {
        var ident = this.parseSequence(sequence[index], identifier);

        var object = this.receive(ident);
        if(object !== false) {
            return object;
        }
    }

    return false;
};

/**
 * Parse the sequence identifier
 * This will result in a usable identifier
 *
 * @method parseSequence
 * @param {Sring} string The sequence string to parse
 * @param identifier
 * @returns {ObjectIdentifier}
 */
ObjectLoader.prototype.parseSequence = function(string, identifier) {
    string = string.replace('<Type>', identifier.getType());
    string = string.replace('<App>', identifier.getApplication());
    string = string.replace('<Package>', identifier.getPackage());
    string = string.replace('<Path>', identifier.getPath().join('.'));
    string = string.replace('<Name>', identifier.getName());

    return new ObjectIdentifier(string);
};

/**
 * This method will check if there is a custom loader sequence, if not return the default.
 *
 * @method getSequence
 * @returns {Array} The complete sequence
 */
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
 * Receive method will triy to return the requested file.
 *
 * @method receive
 * @param {String} identifier The identifier of the object to load.
 * @returns {Object|false} Result of the call when the file isn't found it will return false.
 */
ObjectLoader.prototype.receive = function (identifier) {
    return locators[identifier.getType()].locate(identifier);
};

/**
 * This method will act like the require method, but instead of a path it accepts an identifier.
 *
 * @param {String|ObjectIdentifier} identifier The identifier of the required object
 * @returns {Object} Returns the uninstanciated object.
 */
ObjectLoader.require = function (identifier) {
    if(typeof identifier === 'string') {
        identifier = new ObjectIdentifier(identifier);
    }

    return this.prototype.resolve(identifier);
};

/**
 * Add a locator for a specific type.
 *
 * @param {String} path The path to the locator.
 */
ObjectLoader.addLocator = function (path) {
    var locator = new (require(path))();

    if(!locators[locator._type]) {
        locators[locator._type] = locator;
    }
};

/**
 * The load method will check if the object has been cached.
 * If this is not the case it will try to resolve the object.
 *
 * When an object has been loaded for the first time it is cached for reuse in a later request.
 *
 * @method load
 * @param {String} identifier The identifier of the object to be loaded.
 * @param {Object} config This is the config object to send loaded object.
 * @return {Promise} This will hold the uninitialized object.
 */
ObjectLoader.load = function (identifier, config) {
    function getConfigIdentifier(config) {
        var keys = [];
        var identifier = {};

        for(var index in config) {
            if(config.hasOwnProperty(index)) {
                keys.push(index);
            }
        }

        for(var index in keys) {
            var key = keys[index];

            if(config[key] && config.hasOwnProperty(key)) {
                identifier[key] = config[key];
            }
        }

        return JSON.stringify(identifier);
    }

    var self = this;
    var orgIdentifier = identifier.clone();
    var configIdentifier = getConfigIdentifier(config);

    if (cache[[orgIdentifier.toString(), configIdentifier].join('_')]) {
        var obj = cache[[orgIdentifier.toString(), configIdentifier].join('_')].clone();

        return Promise.resolve(obj);
    } else {
        return Promise.resolve(self.prototype.resolve(identifier))
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
                    cache[[orgIdentifier.toString(), configIdentifier].join('_')] = object;
                }

                return object.clone();
            });
    }
};

// When we start the system, we also set the locators.
ObjectLoader.addLocator('../locator/core');
ObjectLoader.addLocator('../locator/component');

module.exports = ObjectLoader;
