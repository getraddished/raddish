var fs      = require('fs'),
    path    = require('path');

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

FileAdapter.prototype.log = function(code, message) {
    var type = this.codes[code] ? this.codes[code] : 'Info';
    var date = new Date();

    fs.writeSync(this.file, '[' + date.toISOString() + '][' + type + '] ' + message + "\r\n");
};

module.exports = FileAdapter;