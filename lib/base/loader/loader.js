/**
 * This is a complete loader for objects.
 * This will be handeling the identifiers as well.
 */

// The cache placeholder.
// This is a variable which will be used by all the instances.
var cache = {};
var async = require('async');

function BaseLoader() {
    
};

/**
 * The load function will check if the object has been cached.
 * If this is not the case it will try to resolve the object.
 */
BaseLoader.prototype.load = function(identifier) {
    var self = this;
    var orgIdentifier = identifier.clone();

    return new Promise(function(resolve, reject) {
        if(cache[identifier.toString()]) {
            // The object has been cached, good, now return it.
            resolve(cache[identifier.toString()]);
        } else {
            // No cache found, resolve it and cache it.
            self.resolve(identifier, function(Obj) {
                // Set the object in the cache.
                cache[orgIdentifier.toString()] = Obj;

                resolve(Obj);
            });
        }
    });
};

/**
 * Load a specific object.
 * By default it will be checking in the applications folder.
 */
BaseLoader.prototype.resolve = function(identifier, callback) {
    var self = this;
    var name = identifier.getName();
    
    async.waterfall([
        function resolve_step1(next) {
            // Step 1
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function resolve_step2(next) {
            // Step 2
            identifier.setName('default');
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function resolve_step3(next) {
            // Step 3
            identifier.setComponent('default');
            identifier.setName(name);
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function resolve_step4(next) {
            // Step 3
            identifier.setName('default');
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function resolve_step5(next) {
            // Last guess, take the type and try to get it from the framework
            // Also remove the component.
            identifier.setName(name);
            identifier.setApplication('core');
            identifier.setComponent('');

            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function resolve_step6(next) {
            // Last guess, take the type and try to get it from the framework
            // Also remove the component.
            identifier.setName(identifier.getType());

            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(false);
            }
        }
    ], function(Obj) {
        callback(Obj);
    });
};
        
BaseLoader.prototype.receive = function(path) {
    try {
        return require(path);
    } catch(Error) {
        return false;
    }
};

module.exports = new BaseLoader();