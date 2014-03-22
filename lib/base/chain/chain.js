var async   = require('async');
var Base    = require('../base');

function CommandChain(parent) {
    var defer = Q.defer();

    if(parent.behaviors) {
        this.behaviors = parent.behaviors;
        this.identifier = parent.getIdentifier().clone();
        this.loader = new Base();
    }

    this.processBehaviors()
        .then(function(self) {
            defer.resolve(self);
        });

    return defer.promise;
}

/**
 * First we check the name and make it to a function name.
 */
CommandChain.prototype.run = function(behavior, context) {
    console.log('Called');
};

// This command will run in the background
CommandChain.prototype.processBehaviors = function() {
    var defer = Q.defer();

    var self = this;
    // Check the name.
    var i = 0;
    async.each(this.behaviors, function(item, next) {
        if(item.indexOf('.') !== -1) {
            // We have an full Identifier.
            self.loader.getObject(item, null, function(behavior) {
                self.behaviors[i] = behavior;
                i++;
                next();
            });
        } else {
            self.loader.getObject(self.identifier.setPath(['controller', 'behavior']).setName(self.behaviors[i]), null, function(behavior) {
                self.behaviors[i] = behavior;
                i++;
                next();
            });
        }
    }, function(err) {
        defer.resolve(self);
    });

    return defer.promise;
}

module.exports = CommandChain;