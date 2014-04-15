var Application     = require('../application/application');
var http            = require('http');
var Router          = require('../router/router');

/**
 * The main class of our framework. This object will help with registring our applications.
 * @constructor
 */
function Raddish() {
    this.config = {};
};

/**
 * This will set an application handler.
 *
 * @param {String} alias The alias of the application
 * @param {String} path The path to the application.
 * @returns {*}
 */
Raddish.prototype.setApplication = function(alias, path) {
    return Application.setApplication(alias, path);
};

/**
 * This function will set the config of Raddish. This is a global config.
 *
 * @param config
 */
Raddish.prototype.setConfig = function(config) {
    this.config = config;
};

/**
 * This is a config helper to set the public path.
 *
 * @param path
 */
Raddish.prototype.setPublicFolder = function(path) {
    this.config.public = path;
};

/**
 * This will start the listener for http traffic, and will route it to the correct application (if there it isn't a file)
 *
 * @param {Int} port A override for the port given in the config.
 */
Raddish.prototype.start = function(port) {
    if(!port && !this.config.port) {
        throw new Error('No port found to start on!');
    } else {
        http.createServer(function(req, res) {
            new Router().route(req, res);
        }).listen(port || this.config.port);
        console.log('Server started on port:' + (port || this.config.port));
    }
};

module.exports = Raddish;