var apps = {},
    Plugin = require('../plugin/plugin'),
    fs = require('fs');

function Application(config) {
    this.config = config || {};
}

/**
 * This method
 *
 * @param {String} component The name of the component to run.
 * @param {Request} request The NodeJS HTTP request object.
 * @param {Response} response The NodeJS HTTP response object.
 */
Application.prototype.executeComponent = function(component, request, response) {
    var path = this.config.component + '/' + component + '/' + component;

    console.log(path);
    if(!fs.existsSync(path + '.js')) {
        throw new Error('Component doesn\'t exist!');
    }

    var Component = require(path);
    new Component(request, response);
};

/**
 * This function might intentionally crash when the application isn't found.
 *
 * @param path
 */
Application.registerApplication = function(path) {
    Plugin.execute('application', 'before.register');

    var App = require(path),
        app = new App();

    if(app._alias) {
        apps[app._alias] = app;
    }

    Plugin.execute('application', 'after.register');

    return this;
};

Application.findApplication = function(alias) {
    if(apps[alias]) {
        return apps[alias];
    }

    throw new Error('Application not registred!');
};

module.exports = Application;