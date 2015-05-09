var fs      = require('fs'),
    path    = require('path');

/**
 * This adapter will output an error to a file.
 * This object uses an object for its configuration.
 *
 * The config object must hold a file key and as its value to path to the file to use.
 *
 * @param {Object} config Possible config values to use.
 * @constructor
 */
function FileAdapter(config) {
    this.codes = {
        404: 'Not Found',
        500: 'Error'
    };

    try {
        this.file = fs.openSync(process.cwd() + config.file, 'a+');
    } catch(error) {
        throw new Error('Path ' + path.dirname(config.file) + ' not found falling back to console');
    }
}

/**
 * This method will log an error message to the defined file.
 *
 * @method log
 * @param {Integer} code The error code to use.
 * @param {Message} message The error message.
 */
FileAdapter.prototype.log = function(code, message) {
    var type = this.codes[code] ? this.codes[code] : 'Info';
    var date = new Date();

    fs.writeSync(this.file, '[' + date.toISOString() + '][' + type + '] ' + message + "\r\n");
};

module.exports = FileAdapter;