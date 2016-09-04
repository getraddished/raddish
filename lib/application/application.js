var apps = {};

function Application() {

}

/**
 * This function might intentionally crash when the application isn't found.
 *
 * @param path
 */
Application.registerApplication = function(path) {
    var App = require(path),
        app = new App();

    if(app._alias) {
        apps[app._alias] = app;
    }

    return this;
};

Application.findApplication = function(alias) {
    if(apps[alias]) {
        return apps[alias];
    }

    throw new Error('Application not registred!');
};

module.exports = Application;