var util = require('util');

/**
 * This object will handle Browser Exceptions.
 * When a exception is hit it will return the response and end the request.
 *
 * @class BrowserException
 * @param {Int} code Status code to return to the browser
 * @param {String} message Message to return to the browser
 * @param {Boolean} showInConsole Show the message in the console?
 * @constructor
 */
function RaddishError(code, message, showInConsole) {
    RaddishError.super_.call(this);
    RaddishError.super_.captureStackTrace(this, this.constructor);

    this.code = code;
    this.message = message;

//    if(showInConsole) {
//        console.log(message);
//    }
}

util.inherits(RaddishError, Error);

module.exports = RaddishError;