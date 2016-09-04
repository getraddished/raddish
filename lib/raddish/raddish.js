/**
 * This is the main file.
 * This object holds the config and more data.
 */
var config = null,
    fs = require('fs'),
    Application = require('../application/application'),
    http = require('http'),
    https = require('https');

function Raddish() {

}

/**
 * This method sets the config and all of its values.
 *
 * @param {String/ Object/ undefined} conf The optional config for Raddish.
 * @returns {Raddish} the current object for chaining.
 */
Raddish.prototype.setConfig = function(conf) {
    if(typeof conf == 'string') {
        config = require(conf);
    } else if(typeof conf == 'object') {
        config = conf;
    } else {
        config = require(process.cwd() + '/config.json');
    }

    return this;
};

/**
 * This method proxies the path to Application.registerApplication and returns itself.
 *
 * @param {String} path The absolute path to the application.
 * @returns {Raddish} The current object for chaining.
 */
Raddish.prototype.registerApplication = function(path) {
    Application.registerApplication(path);

    return this;
};

/**
 * This method starts the server.
 * All the requests that come in will be passed to the router. Which will pick it up from here.
 *
 * @param {int} port The optional port number.
 */
Raddish.prototype.start = function(port) {
    port = port || config.port;

    http.createServer(function(request, response) {
        // Hand the request over to the router.
        // This is the most difficult piece of functionality.
        console.log('Called');
    }).listen(port, function() {
        console.log('Raddish started on port: ' + port);
    });
};

module.exports = new Raddish();