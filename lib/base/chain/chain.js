var async   = require('async');
var Base    = require('../base');

function CommandChain(parent) {
    var self = this;

    return new Promise(function(resolve, reject) {
        if(parent.behaviors) {
            self.behaviors = parent.behaviors;
            self.identifier = parent.getIdentifier().clone();
            self.loader = new Base();
        }

        this.processBehaviors()
            .then(function(self) {
                resolve(self);
            });
    });
}

/**
 * First we check the name and make it to a function name.
 */
CommandChain.prototype.run = function(behavior, context) {
    console.log('Called');
};

// This command will run in the background
CommandChain.prototype.processBehaviors = function() {
    var self = this;
    // Check the name.
    var i = 0;

    return new Promise(function(resolve, reject) {
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
    });
}

module.exports = CommandChain;