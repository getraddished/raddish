"use strict";

var Inflector   = require('../../inflector/inflector');

/**
 * CommandChain class for the behaviors.
 * This object when created will process the behaviors.
 *
 * @class CommandChain
 * @since 28 March 2014
 * @param {Object} parent Parent object which needs to hold the behaviors.
 * @returns {Promise} With the promised object.
 * @constructor
 */
function CommandChain(parent) {
    var self = this;

    if (parent.behaviors) {
        this.behaviors = parent.behaviors ? parent.behaviors : {};
        this.identifier = parent.getIdentifier().clone();
        this.caller = parent;
    }

    return self.processBehaviors();
}

/**
 * Run the requested behaviors, the behavior names are dot separated
 *
 * @method run
 * @param {String} behavior The name of the behavior to run (eg: before.run)
 * @param {Object} context The context of the behavior in which it has to run. (DCI)
 * @returns {Promise} When all the behaviors have ran we will return a resolve of the context.
 */
CommandChain.prototype.run = function (behavior, context) {
    var self = this;
    var method = this.getName(behavior);
    var functions = [];
    context.caller = this.caller;

    for(var index in self.behaviors) {
        var item = this.behaviors[index];

        if(typeof item[method] == 'function') {
            functions.push(item[method](context));
        }
    }

    return Promise.all(functions)
        .then(function() {
            return context;
        });
};

/**
 * This function will run in the background and map all the behavior till they are ready to run.
 *
 * @method processBehaviors
 * @returns {Promise} Return the CommandChain object when the behaviors have been processed.
 */
CommandChain.prototype.processBehaviors = function () {
    var self = this;
    var identifier = self.identifier.clone();

    var path = self.identifier.getPath();
    path.push('behavior');
    
    identifier.setPath(path);

    return new Promise(function (resolve, reject) {
        async.each(Object.keys(self.behaviors), function parseBehaviors(item, next) {
            if (item.indexOf('.') !== -1) {
                // We have an full Identifier.
                Service.get(item, null)
                    .then(function (behavior) {
                        self.behaviors[item] = behavior;
                        next();
                    });
            } else {
                Service.get(identifier.setName(item), self.behaviors[item])
                    .then(function (behavior){
                        self.behaviors[item] = behavior;
                        next();
                    });
            }
        }, function (err) {
            resolve(self);
        });
    });
};

/**
 * Convert the behavior name to a function name.
 *
 * @private
 * @method getName
 * @param {String} method The dot-separated name of the behavior
 * @returns {string} The behavior name as function name.
 */
CommandChain.prototype.getName = function(method) {
    var parts = method.split('.');
    parts = parts.map(function(value) {
        return Inflector.capitalize(value.toLowerCase());
    });

    return 'on' + parts.join('');
};

module.exports = CommandChain;