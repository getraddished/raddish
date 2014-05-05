/**
 * This is a complete loader for objects.
 * This will be handeling the identifiers as well.
 */

// The cache placeholder.
// This is a variable which will be used by all the instances.
var cache = {};
var async = require('async');

/**
 * BaseLoader object which handles all the loading of the requested objects.
 *
 * @class BaseLoader
 * @since 28 March 2014
 * @constructor
 */
function BaseLoader() {

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
BaseLoader.prototype.load = function (identifier) {
    var self = this;
    var orgIdentifier = identifier.clone();

    if (cache[orgIdentifier.toString()]) {
        // The object has been cached, good, now return it.
        return Promise.resolve(cache[orgIdentifier.toString()]);
    } else {
        // No cache found, resolve it and cache it.
        return self.resolve(identifier)
            .then(function (Obj) {
                // Set the object in the cache.
                cache[orgIdentifier.toString()] = Obj;

                return Obj;
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

    return new Promise(function(resolve, reject) {
        Promise.cast(self.receive(identifier.getFilePath()))
            .then(function(object) {
                if(object != false) {
                    resolve(object);
                }

                identifier.setName('default');
                return self.receive(identifier.getFilePath());
            })
            .then(function(object) {
                if(object != false) {
                    resolve(object);
                }

                identifier.setComponent('default');
                identifier.setName(name);
                return self.receive(identifier.getFilePath());
            })
            .then(function(object) {
                if(object != false) {
                    resolve(object);
                }

                identifier.setName('default');
                return self.receive(identifier.getFilePath());
            })
            .then(function(object) {
                if(object != false) {
                    resolve(object);
                }

                identifier.setName(name);
                identifier.setApplication('core');
                identifier.setComponent('');
                return self.receive(identifier.getFilePath());
            })
            .then(function(object) {
                if(object != false) {
                    resolve(object);
                }

                identifier.setName(identifier.getType());
                return self.receive(identifier.getFilePath());
            })
            .then(function(object) {
                resolve(object);
            })
            .done();
    });
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