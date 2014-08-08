/**
 * RaddishError
 * 
 * This is an object which will call to adapters.
 * But this object will also output to the dispatcher. When an error is dispatched it will hold a few options.
 * These are the severity, the message and optional data.
 * 
 * This will be fluently parsed to all the adapters and then used be them.
 * The adapters which will be supported initially are:
 * * log4js
 * * Winston
 * 
 * To use them you do need to add the logging module to your own project,
 * if this module isn't present then we will fallback to the console. A check will be added in this object.
 * 
 * The options will also have a global notation. Which will be:
 * {
 *      "logging": {
 *          "adapter": "log4js", (log4js, winston or console)
 *          "handler": "file",
 *          "options": {
 *              Specific handler options according to the framework documentation.
 *          }
 *      }
 * }
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
function RaddishError(code, message, showInConsole) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.code = code;
    this.message = message;
}

module.exports = RaddishError;