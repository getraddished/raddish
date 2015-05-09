/**
 * This is the default and fallback log adapter in the system.
 *
 * @class ConsoleAdapter
 * @param {Object} options Possible options the adapter uses.
 * @constructor
 */
function ConsoleAdapter(options) {
    this.codes = {
        404: 'info',
        500: 'error'
    };
}

/**
 * This method will log an error to the console.
 *
 * @method log
 * @param {Integer} code The error code for the error.
 * @param {String} message The error message.
 */
ConsoleAdapter.prototype.log = function(code, message) {
    var method = this.codes[code] ? this.codes[code] : 'log';
    
    console[method](message);
};

module.exports = ConsoleAdapter;