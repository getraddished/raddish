'use strict';

/**
 * The CommandChain method will be responsible for the chain of command.
 * This object will run the requested method called on the
 *
 * @class CommandChain
 */
class CommandChain {
    constructor(caller, behaviors) {
        this.caller = caller;
        this.behaviors = behaviors || {};
    }

    execute(method, context) {
        context.caller = this.caller;

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
        var promises = [],
            ObjectManager = require('../object/manager'),
            identifier = null,
            path = [];

        if(Object.keys(this.behaviors).length > 0) {
            for(var behavior in this.behaviors) {
                if(this.behaviors.hasOwnProperty(behavior)) {
                    identifier = behavior;

                    if (behavior.indexOf(':') === -1) {
                        identifier = this.caller.getIdentifier().clone();
                        path = [identifier.getPath().shift(), 'behavior'];

                        identifier
                            .setPath(path)
                            .setName(behavior);
                    }

                    promises.push(ObjectManager.get(identifier, this.behaviors[behavior]));
                }
            }
        }

        return Promise.all(promises);
    }
}

module.exports = CommandChain;