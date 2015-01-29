"use strict";

var util            = require('util'),
    applications    = {};

/**
 * Application class to structure everything and give more flexibility.
 *
 * @class Application
 * @constructor
 */
function Application() {
    this.config = {};
};

/**
 * This function will set the config of the Application.
 *
 * @method setConfig
 * @param {Object} config The config object for the Application
 * @returns {Application} For chaning purposes.
 */
Application.prototype.setConfig = function(config) {
    this.config = config;

    return this;
};

/**
 * This function will try to find the component and will run it.
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
 * This function will try to get the application module and add this to the applications registry.
 *
 * @method setApplication
 * @param {String} alias The alias of the Application.
 * @param {String} path The path to the Application file.
 * @returns {Application}
 */
Application.setApplication = function(alias, path) {
    var Obj = require(process.cwd() + '/' + path);
    applications[alias] = new Obj();

    return this;
};

/**
 * This function returns an initialized application ready to use.
 *
 * @method getApplication
 * @param {String} alias The alias of the application.
 * @returns {*}
 */
Application.getApplication = function(alias) {
    return applications[alias];
};

/**
 * This function will try to match an application to the url,
 * If no application is found an error will be fired.
 * If the application isn't found it will throw a RaddishError.
 *
 * @method matchApplication
 * @param {Object} url The url object of the (parsed) request.
 */
Application.matchApplication = function(url) {
    if(applications[url.query.app]) {
        return applications[url.query.app];
    } else {
        throw new RaddishError(404, 'Application not found!');
    }
};

module.exports = Application;