var Base = require('../base/base');
var util = require('util');
var zlib = require('zlib');

function ViewAbstract() {

}

util.inherits(ViewAbstract, Base);

ViewAbstract.prototype.initialize = function(config) {
    var self = this;

    return new Promise(function(resolve, reject) {
        ViewAbstract.super_.prototype.initialize.call(self, config)
            .then(function(view) {
                self.request = config.request;
                self.response = config.response;
                self.response.setHeader('Content-Type', config.mimetype);

                resolve(self);
            });
    });
};

ViewAbstract.prototype.setData = function(data) {
    this.data = data;
};

ViewAbstract.prototype.GZip = function(data) {
    var self = this;

    return new Promise(function(resolve, reject) {
        if(self.request.headers['accept-encoding'] && self.request.headers['accept-encoding'].match(/\bgzip\b/) && self.getConfig('gzip')) {
            zlib.gzip(data, function(err, compressed) {
                self.response.writeHead(200, { 'content-encoding': 'gzip' });
                resolve(compressed);
            });
        } else {
            resolve(data);
        }
    });
};

module.exports = ViewAbstract;