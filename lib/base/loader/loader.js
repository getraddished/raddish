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
BaseLoader.prototype.load = function(identifier, callback) {
    if(cache[identifier.toString()]) {
        // The object has been cached, good, now return it.
        
        return callback(cache[identifier.toString()]);
    } else {
        // No cache found, resolve it and cache it.
        
        this.resolve(identifier, function(Obj) {
            // Set the object in the cache.
            cache[identifier.toString()] = Obj;
            
            callback(Obj);
        });
    }
};

/**
 * Load a specific object.
 * By default it will be checking in the applications folder.
 */
BaseLoader.prototype.resolve = function(identifier, callback) {
    var self = this;
    var name = identifier.getName();
    
    async.waterfall([
        function(next) {
            // Step 1
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function(next) {
            // Step 2
            identifier.setName('default');
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function(next) {
            // Step 3
            identifier.setComponent('default');
            identifier.setName(name);
            
            if((object = self.receive(identifier.getFilePath())) !== false) {
                next(object);
            } else {
                next(null);
            }
        },
        function(next) {
            // Step 3
            identifier.setName('default');
            
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