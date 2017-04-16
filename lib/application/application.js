'use strict';

var apps = {},
    Plugin = require('../plugin/plugin'),
    fs = require('fs');

/**
 * The application class will hold a registry of all the registred applications,
 * next to that it will act as a basic class for the applications.
 *
 * @class Application
 */
class Application {
    constructor(config) {
        this.config = config || {};
    }

    /**
     * This method tries to execute a component within the context of the application.
     * When the component doesn't exist an error is thrown.
     *
     * @method executeComponent
     * @param {String} component The name of the component to run.
     * @param {Request} request The NodeJS HTTP request object.
     * @param {Response} response The NodeJS HTTP response object.
     * @return {Object} the found component.
     */
    executeComponent(component, request, response) {
        var path = this.config.component + '/' + component + '/' + component;

        if(!fs.existsSync(path + '.js')) {
            throw new Error('Component doesn\'t exist!');
        }

        return new (require(path))(request, response);
    }

    /**
     * This method will return the component config if the requested component.
     *
     * @method _getComponentConfig
     * @param {String} component The component to return the config from.
     * @return {Object} The component config.
     * @private
     */
    _getComponentConfig(component) {
        if(!this.config['config']) {
            return {};
        }

        try {
            return require(this.config.config + '/' + component + '.json');
        } catch(err) {
            return {};
        }
    }

    /**
     * This method will register an application to Raddish.
     * If the application isn't found you will receive an error on startup.
     *
     * @method registerApplication
     * @param path Path to the application file.
     * @return {Application} The current application layer for chaining.
     */
    static registerApplication(path) {
        Plugin.execute('application', 'before.register');

        var App = require(path),
            app = new App();

        if(app._alias) {
            apps[app._alias] = app;
        }

        Plugin.execute('application', 'after.register');

        return this;
    }

    /**
     * This method will try to find a registred application.
     * When the application isn't found an error is thrown.
     *
     * @method findApplication
     * @param {String} alias The alias of the application.
     * @return {Application} The Application that is found.
     */
    static findApplication(alias) {
        if(apps[alias]) {
            return apps[alias];
        }

        throw new Error('Application not registred!');
    }
}

module.exports = Application;