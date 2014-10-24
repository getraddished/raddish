"use strict";

var Application     = require('../application/application');
var http            = require('http');
var https           = require('https');
var Router          = require('../router/router');
var config          = {};
var cluster         = require('cluster');
var fs              = require('fs');
var Notifier        = require('update-notifier');
var Plugin          = require('../plugin/plugin');


/**
 * The main class of our framework. This object will help with registring our applications.
 * @constructor
 */
function Raddish() {

};

/**
 * This will set an application handler.
 *
 * @method setApplication
 * @param {String} alias The alias of the application
 * @param {String} path The path to the application.
 * @returns {*}
 */
Raddish.prototype.setApplication = function(alias, path) {
    var plugins = new Plugin();
    var self    = this;

    return plugins.get('application')
        .then(function(plugins) {
            return plugins.execute('before.register', alias, path);;
        })
        .then(function(plugins) {
            var app = Application.setApplication(alias, path)
            app = app.getApplication(alias);

            return [plugins, app];
        })
        .spread(function(plugins, app) {
            return plugins.execute('after.register', app);;
        })
        .then(function(plugins) {
            return self;
        });
};

/**
 * This function will set the config of Raddish which is located in a JSON file..
 *
 * @method setConfig
 * @param config
 */
Raddish.prototype.setConfig = function(cnf) {
    var tmp = fs.readFileSync(cnf);

    config = JSON.parse(tmp);
};

/**
 * This function will get a single config value,
 * if there is no key given it will return the complete config.
 *
 * @method getConfig
 * @param {Name} key The key of the config value
 * @returns {*}
 */
Raddish.prototype.getConfig = function(key) {
    if(key) {
        key = key.split('.');

        var base = config;
        for(var index in key) {
            if(base[key[index]]) {
                base = base[key[index]];
            } else {
                return false;
            }
        }

        return base;
    } else {
        return config;
    }
};

/**
 * This is a config helper to set the public path.
 *
 * @method setPublicFolder
 * @param {String} path The path to the public folder.
 */
Raddish.prototype.setPublicFolder = function(path) {
    config.public = path;
};

/**
 * This will start the listener for http traffic, and will route it to the correct application (if there it isn't a file)
 *
 * @param {Int} port A override for the port given in the config.
 */
Raddish.prototype.start = function(port) {
    var Threads = require('../threads/threads');
    var plugins = new Plugin();
    var self    = this;

    plugins.get('system')
        .then(function(plugins) {
            return plugins.execute('before.start');
        })
        .then(function(plugins) {
            if(!port && !config.port) {
                throw new Error('No port found to start on!');
            }

            if(config.threads) {
                if(!cluster.isMaster) {
                    self.startWebServer(port);
                } else {
                    console.log('Server started on port: ' + (port || config.port));
                }
            } else {
                self.startWebServer(port);
                console.log('Server started on port: ' + (port || config.port));
            }

            if(config.threads) {
                if(config.socketio && !cluster.isMaster) {
                    Socket.start();
                } else if(config.socketio && cluster.isMaster) {
                    console.log('Socket.io started on port: ' + (config.socketio.port || 1338));
                }
            } else {
                if(config.socketio) {
                    Socket.start();
                    console.log('Socket.io started on port: ' + (config.socketio.port || 1338));
                }
            }

            return plugins;
        })
        .then(function() {
            plugins.execute('after.start');
        });
};

/**
 * This is part of an ExpressJS middleware application.
 * And is supposed to listen to them as well.
 *
 * @method express
 * @param {Object} req ExpressJS request object.
 * @param {Object} res ExpressJS response object.
 * @param {Function} next ExpressJS next handler.
 */
Raddish.prototype.express = function(req, res, next) {
    new Router().route(req, res);
};

/**
 * This function will start the webserver
 * with the right specification.
 *
 * @method startWebServer
 * @param {Int} port The late port of the server.
 */
Raddish.prototype.startWebServer = function(port) {
    var cnf     = undefined;
    var route   = function(req, res) {
        new Router().route(req, res);
    }

    if(config.ssl) {
        cnf = {
            key: fs.readFileSync(config.ssl.key),
            cert: fs.readFileSync(config.ssl.cert)
        };
    }

    var server = cnf ? https.createServer(cnf, route) : http.createServer(route);
    server.listen(port || config.port);
};

/**
 * This function will check if there is an update available from NPM.
 * If there is an update, then the user should update manually.
 *
 * @method checkUpdate
 */
Raddish.prototype.checkUpdate = function() {
    if(!config.threads || cluster.isMaster) {
        var notifier = Notifier({
            packageName: 'raddish',
            packageVersion: '2.1.3'
        });

        if (notifier.update) {
            notifier.notify();
        }
    }
}

module.exports = new Raddish();