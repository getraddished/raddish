var Base = require('../base/base');
var util = require('util');
var applications = {};

function Application() {
    this.config = undefined;
};

util.inherits(Application, Base);

Application.prototype.setConfig = function(config) {
    this.config = config;

    return this;
};

Application.setApplication = function(alias, path) {
    applications[alias] = require(path);

    return this;
};

Application.prototype.getApplication = function(alias) {
    return applications[alias];
};

/**
 * This function will try to match an application to the url,
 * If no application is found an error will be fired.
 *
 * @method matchApplication
 * @param url
 */
Application.matchApplication = function(url) {

};

module.exports = Application;