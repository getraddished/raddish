'use strict';

var Inflector = require('raddish-inflector');

/**
 * The CommandChain method will be responsible for the chain of command.
 * This object will run the requested method called on the
 *
 * @constructor
 */
class CommandChain {
    constructor(caller, behaviors) {
        this.caller = caller;
        this.behaviors = behaviors || [];
    }

    execute(method, context) {
        return this.getBehaviors()
            .then(function(behaviors) {
                var promises = [];

                for(var behavior of behaviors) {
                    if(behavior.hasMethod(method)) {
                        promises.push(behavior.execute(method, context));
                    }
                }

                return Promise.all(promises);
            })
            .then(function() {
                return context;
            });
    }

    getBehaviors() {
        var promises = [];

        for(var promise of this.behaviors) {
            var identifier = behavior;

            if(behavior.indexOf(':') === -1) {
                identifier = this.caller.getIdentifier()
                    .clone()
                    .setName(behavior);
            }

            promises.push(identifier);
        }

        return Promise.all(promises);
    }
}

module.exports = CommandChain;