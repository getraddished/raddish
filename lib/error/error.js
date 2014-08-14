/**
 * RaddishError
 * 
 * This is an object which will call to adapters.
 * But this object will also output to the dispatcher. When an error is dispatched it will hold a few options.
 * These are:
 * * severity:  The level of the error.
 * * message:   The message given.
 * 
 * This will be fluently parsed to all the adapters and then used be them.
 * The adapters which will be supported initially are:
 * * log4js
 * * Winston
 * * console
 * 
 * To use them you do need to add the logging module to your own project,
 * if this module isn't present then we will fallback to the console. A check will be added in this object.
 * 
 * The options will also have a global notation. Which will be:
 * {
 *      "logging": {
 *          "adapter": "file", (file or console)
 *          "options": {
 *              Specific handler options according to the adapter (http://getraddish.com/advanced/logging.html).
 *          }
 *      }
 * }
 * 
 * When a error is thrown the object will check the for the config variable in Raddish
 * for the error handler.
 * 
 * When this one is present it will call the error handler.
 * When there is none present or the error handler presents an error
 * then we will use the default (console).
 * 
 * After the error has been logged it will be returned to the dispatcher.
 */

/**
 * This object will handle Browser Exceptions.
 * When a exception is hit it will return the response and end the request.
 *
 * @class RaddishError
 * @param {Int} code Status code to return to the browser
 * @param {String} message Message to return to the browser
 * @param {Boolean} showInConsole Show the message in the console?
 * @constructor
 */
function RaddishError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    
    var logging     = Raddish.getConfig('logging');
    this.adapter    = this.getAdapter((logging.adapter ? logging.adapter : 'console'), logging.options);
    
    this.code       = code;
    this.message    = message;
    
    // TODO: Parse the stack to be better JSON.
    
    this.adapter.log(code, message);
}

RaddishError.prototype.getAdapter = function(adapter, options) {
    if(typeof this.adapter === 'object') {
        return this.adapter;
    } else {
        var object = {};

        try {
            object = require('./adapter/' + adapter);
        } catch(error) {
            // When an error is thrown show it in the console.
            console.log(error);

            // Then fallback to console.
            object = require('./adapter/console');
        }

        return new object(options);
    }
};

module.exports = RaddishError;