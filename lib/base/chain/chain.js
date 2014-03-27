var async       = require('async');
var Inflector   = require('../../inflector/inflector');

function CommandChain(parent) {
    var self = this;

    return new Promise(function (resolve, reject) {

        if (parent.behaviors) {
            self.behaviors = parent.behaviors ? parent.behaviors : {};
            self.identifier = parent.getIdentifier().clone();
            self.loader = parent;
        }

        self.processBehaviors()
            .then(function(self) {
                resolve(self);
            });
    });
}

/**
 * First we check the name and make it to a function name.
 */
CommandChain.prototype.run = function (behavior, context) {
    var self = this;
    var method = this.getName(behavior);
    
    // TODO: Run all the behaviors.
    return new Promise(function(resolve, reject) {
        async.each(self.behaviors, function (item, next) {
            if(typeof item[method] == 'function') {
                item[method](context)
                    .then(function(context) {
                        next();
                    });
            } else {
                next();
            }
        }, function(err) {
            resolve(context);
        });
    });
};

// This command will run in the background
CommandChain.prototype.processBehaviors = function () {
    var self = this;
    // Check the name.
    var i = 0;

    // TODO: Fix this part.
    return new Promise(function (resolve, reject) {
        async.each(self.behaviors, function (item, next) {
            if (item.indexOf('.') !== -1) {
                // We have an full Identifier.
                self.loader.getObject(item, null)
                    .then(function (behavior) {
                        self.behaviors[i] = behavior;
                        i++;
                        next();
                    });
            } else {
                self.loader.getObject(self.identifier.setPath(['controller', 'behavior']).setName(self.behaviors[i]), null)
                    .then(function (behavior){
                        self.behaviors[i] = behavior;
                        i++;
                        next();
                    });
            }
        }, function (err) {
            resolve(self);
        });
    });
};

CommandChain.prototype.getName = function(method) {
    var parts = method.split('.');
    parts = parts.map(function(value) {
        return Inflector.capitalize(value.toLowerCase());
    });
    
    return 'on' + parts.join('');
};

module.exports = CommandChain;