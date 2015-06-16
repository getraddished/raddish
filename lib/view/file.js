var AbstractView = require('./abstract'),
    util = require('util'),
    fs = require('fs');

/**
 * This method makes sure the user is presented with a file download.
 *
 * @class ViewFile
 * @extends AbstractView
 * @param {Object} config The config object to use.
 * @constructor
 */
function ViewFile(config) {
    this.output = '';
    this.paht = '';

    AbstractView.call(this, config);
}

util.inherits(ViewFile, AbstractView);

ViewFile.prototype.initialize = function (config) {
    config.mimetype = 'application/octet-stream';

    return AbstractView.prototype.initialize.call(this, config);
};

/**
 * The display method will check if a file has been loaded in the output, if so this file will be returned.
 * If a file has been presented in the path variable a stream will be returned.
 *
 * In a use case, this object will be extended from.
 *
 * @method display
 * @returns {Promise} A Promise containing the file file to download.
 */
ViewFile.prototype.display = function() {
    var self = this;

    // If we have loaded the data of the file to the output variable then we will return that data.
    if(this.output) {
        return Promise.resolve(this.output);
    }

    // If the path is set we will return that file.
    if(this.path) {
        return new Promise(function(resolve, reject) {
            fs.readFile(self.path, function(err, data) {
                if(err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }
};

module.exports = ViewFile;