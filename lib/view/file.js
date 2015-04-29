var AbstractView = require('./abstract'),
    util = require('util'),
    Inflector = require('../inflector/inflector'),
    fs = require('fs');

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

ViewFile.prototype.display = function() {
    var self = this;

    // If we have loaded the data of the file to the output variable then we will return that data.
    if(this.output) {
        return Promsie.resolve(this.output);
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