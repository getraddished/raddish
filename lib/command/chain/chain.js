"use strict";

var Inflector   = require('../../inflector/inflector');
var through2    = require('through2');

/**
 * CommandChain class for the behaviors.
 * This object when created will process the behaviors.
 * This will be done in the way of Chain of Responsibility.
 *
 * @class CommandChain
 * @param {Object} parent Parent object which needs to hold the behaviors.
 * @returns {Promise} With the promised object.
 * @constructor
 */
function CommandChain(parent) {
    if (parent.behaviors) {
        this.behaviors = parent.behaviors ? parent.behaviors : {};
        this.identifier = parent.getIdentifier().clone();
        this.caller = parent;
        this.functions = [];
    }

    this.processBehaviors();

    return Promise.resolve(this);
}

/**
 * Run the requested behaviors, the behavior names are dot separated
 *
 * @method run
 * @param {String} behavior The name of the behavior to run (eg: before.run)
 * @param {Object} context The context of the behavior in which it has to run. (DCI)
 * @returns {Promise} When all the behaviors have ran we will return a resolve of the context.
 */
CommandChain.prototype.run = function (method, context) {
    var self = this;
    context.caller = this.caller;

    if(Raddish.getConfig('stream') && context.result && context.result['pipe']) {
        return this.runStream(method, context);
    }

    return Promise.all(this.functions)
        .each(function(behavior) {
            if(behavior.hasMethod(method)) {
                return behavior.execute(method, context);
            }
        })
        .then(function() {
            return context;
        });
};

CommandChain.prototype.runStream = function(method, context) {
    var self = this;

    context.result = context.result.pipe(through2.obj(function(chunk, enc, callback) {
        context.result = chunk;

        return self.run(method, context)
            .then(function(context) {
                callback(null, context.result);
            })
    }));

    return context;
};

/**
 * This function will run in the background and map all the behavior till they are ready to run.
 *
 * @method processBehaviors
 * @returns {Promise} Return the CommandChain object when the behaviors have been processed.
 */
CommandChain.prototype.processBehaviors = function () {
    var identifier = this.identifier.clone();
    var path = this.identifier.getPath();

    path.push('behavior');
    identifier.setPath(path);

    for(var index in this.behaviors) {
        if (index.indexOf('.') !== -1) {
            this.functions.push(ObjectManager.get(index, this.behaviors[index]));
        } else {
            this.functions.push(ObjectManager.get(identifier.setName(index), this.behaviors[index]));
        }
    }
};

module.exports = CommandChain;