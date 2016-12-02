'use strict';

/**
 * The CommandChain method will be responsible for the chain of command.
 * This object will run the requested method called on the
 *
 * @constructor
 */
class CommandChain {
    execute(method, context) {
        return Promise.resolve(context);
    }
}

module.exports = CommandChain;