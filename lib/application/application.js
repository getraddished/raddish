"use strict";

var util            = require('util'),
    applications    = {};

/**
 * The Application object holds the information about every application,
 * including the config for the component and config directories.
 *
 * @class Application
 * @constructor
 */
function Application() {
    this.config = {};
}

/**
 * The setConfig method will set the config for the current Application object.
 *
 * @method setConfig
 * @param {Object} config The config object for the Application
 * @returns {Application} The application object for chaning purposes.
 */
Application.prototype.setConfig = function(config) {
    this.config = config;

    return this;
};

/**
 * This method will try to find the component and will run it.
 * If the component isn't found it will throw a RaddishError.
 *
 * @method runComponent
 * @param {String} component The component to search for.
 * @param {Object} req NodeJS request object.
 * @param {Object} res NodeJS response object.
 */
Application.prototype.runComponent = function(component, req, res) {
    try {
        var Component = require(this.config.component + '/' + component + '/' + component);
        new Component(req, res);
    } catch(error) {
        if(error instanceof RaddishError) {
            throw error;
        }

        throw new RaddishError(404, 'Component not found!');
    }
};

/**
 * This method will try to get the application module and add this to the applications registry.
 *
 * @method setApplication
 * @param {String} alias The alias of the Application.
 * @param {String} path The path to the Application file.
 * @returns {Application} The application object for chaining purposes.
 */
Application.setApplication = function(alias, path) {
    var Obj = require(process.cwd() + '/' + path);
    applications[alias] = new Obj();

    return this;
};

/**
 * This method will teturn application instance bound to the given object.
 *
 * @method getApplication
 * @param {String} alias The alias of the application.
 * @returns {Application} The application registred to the alias.
 */
Application.getApplication = function(alias) {
    return applications[alias];
};

/**
 * This method will try to match an application to the url,
 * If no application is found an error will be fired.
 * If the application isn't found it will throw a RaddishError.
 *
 * @method matchApplication
 * @param {Object} url The url object of the (parsed) request.
 */
Application.matchApplication = function(alias) {
    if(applications[alias]) {
        return applications[alias];
    } else {
        throw new RaddishError(404, 'Application not found!');
    }
};

module.exports = Application;