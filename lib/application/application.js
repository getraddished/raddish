'use strict';

var apps = {},
    Plugin = require('../plugin/plugin'),
    fs = require('fs');

class Application {
    constructor(config) {
        this.config = config || {};
    }

    /**
     * This method
     *
     * @param {String} component The name of the component to run.
     * @param {Request} request The NodeJS HTTP request object.
     * @param {Response} response The NodeJS HTTP response object.
     */
    executeComponent(component, request, response) {
        var path = this.config.component + '/' + component + '/' + component;

        if(!fs.existsSync(path + '.js')) {
            throw new Error('Component doesn\'t exist!');
        }

        return new (require(path))(request, response);
    }

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
     * This function might intentionally crash when the application isn't found.
     *
     * @param path Path to the application file.
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

    static findApplication(alias) {
        if(apps[alias]) {
            return apps[alias];
        }

        throw new Error('Application not registred!');
    }
}

module.exports = Application;