var Base = require('../base/base');
var util = require('util');
var applications = {};

/**
 * Application class to structure everything and give more flexibility.
 *
 * @class Application
 * @constructor
 */
function Application() {
    this.config = {};
};

util.inherits(Application, Base);

Application.prototype.setConfig = function(config) {
    this.config = config;

    return this;
};

Application.setApplication = function(alias, path) {
    var Obj = require(process.cwd() + '/' + path);
    applications[alias] = new Obj();

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
    if(applications[url.query.app]) {
        return applications[url.query.app];
    } else {
        throw new RaddishError(404, 'Application not found!');
    }
};

/**
 * Run a single component.
 */
Application.prototype.runComponent = function(component, req, res) {
    // Require the component which will do its own magic.
    try {
        var Component = require(this.config.componentFolder + '/' + component + '/' + component);
        new Component(req, res);
    } catch(error) {
        throw new RaddishError(404, 'Component not found!');
    }
};

module.exports = Application;