/**
 * This is the main file.
 * This object holds the config and more data.
 */
var config = null,
    fs = require('fs'),
    Application = require('../application/application'),
    http = require('http'),
    https = require('https'),
    cluster = new (require('raddish-threads')),
    SocketIO = require('socket.io'),
    ObjectLoader = require('raddish-loader').Loader.getInstance(),
    started = false,
    Router = require('../router/router'),
    applicationQueue = [],
    instance = null;

class Raddish {
    /**
     * This method sets the config and all of its values.
     *
     * @param {String/ Object/ undefined} conf The optional config for Raddish.
     * @returns {Raddish} the current object for chaining.
     */
    setConfig(config) {
        if(typeof conf == 'string') {
            config = require(conf);
        } else if(typeof conf == 'object') {
            config = conf;
        } else {
            config = require(process.cwd() + '/config.json');
        }

        return this;
    }

    /**
     * This method returns the value of the config. When no identifier is given
     * the complete config is returned.
     *
     * When a part of the identifier isn't found in the config false will be returned.
     *
     * @param {String/null} identifier The dot-separated identifier of the config value.
     * @returns {*} The data found in the config.
     */
    getConfig(identifier) {
        if(config === null) {
            return false;
        }

        if(!identifier) {
            return config;
        }

        if(identifier.indexOf('.') === -1) {
            return config[identifier] || false;
        }

        var parts = identifier.split('.'),
            base = config;

        for(var index in parts) {
            if(parts.hasOwnProperty(index)) {
                if(!base[parts[index]]) {
                    return false;
                }

                base = base[parts[index]];
            }
        }

        return base;
    }

    preStart(callback) {
        initialized = true;

        var sequence = this.getConfig('sequence') || [
                '<Type>://<App>/<Package>.<Path>.<Name>',
                '<Type>://<App>/<Package>.<Path>.default',
                '<Type>://<App>/default.<Path>.<Name>',
                '<Type>://<App>/default.<Path>.default',
                'core:<Package>.<Path>.<Name>',
                'core:<Package>.<Path>.default',
                'core:<Path>.<Name>',
                'core:<Path>.default'
            ];

        if(this.getConfig('public')) {
            Router.setPublicPath(process.cwd() + this.getConfig('public'));
        }

        ObjectLoader.addLocator(__dirname + '/../object/locator/core');
        ObjectLoader.addLocator(__dirname + '/../object/locator/component');
        ObjectLoader.setSequence(sequence);

        if(callback) {
            callback(ObjectLoader);
        }

        started = true;

        return this;
    }

    /**
     * This method proxies the path to Application.registerApplication and returns itself.
     *
     * @param {String} path The absolute path to the application.
     * @returns {Raddish} The current object for chaining.
     */
    registerApplication(path) {
        if(!started) {
            applicationQueue.push(path);
        } else {
            Application.registerApplication(path);
        }

        return this;
    }

    /**
     * This method starts the server.
     * All the requests that come in will be passed to the router. Which will pick it up from here.
     *
     * @param {int} port The optional port number.
     */
    start(port) {
        this.preStart();

        var ssl = this.getConfig('ssl'),
            server = null;

        port = port || this.getConfig('port');

        if(config.threads && cluster.isMaster) {
            cluster.start();
            console.log('Raddish started on port: ' + port);

            if(this.getConfig('socketio')) {
                console.log('Socket.io started on port: ' + (this.getConfig('socketio.port') || 1338));
            }
        } else {
            if(ssl && ssl.key && ssl.cert) {
                server = https.createServer(options, Router.route.bind(Router));
            } else {
                if(ssl) {
                    console.log('There is an error with the ssl settings!');
                    console.log('Falling back to http!')
                }
            }

            if(this.getConfig('socketio')) {
                new SocketIO((this.getConfig('socketio.port') || 1338));
                if(!config.threads) {
                    console.log('Socket.io started on port: ' + (this.getConfig('socketio.port') || 1338));
                }
            }

            server = http.createServer(Router.route.bind(Router));
            server.listen(port, function() {
                if(!config.threads) {
                    console.log('Raddish started on port: ' + port);
                }
            });
        }

        if(applicationQueue.length > 0) {
            for(var index in applicationQueue) {
                if(applicationQueue.hasOwnProperty(index)) {
                    this.registerApplication(applicationQueue[index]);
                }
            }
        }

        return this;
    }

    static getInstance() {
        if(instance === null) {
            instance = new Raddish();
        }

        return instance;
    }
}

module.exports = Raddish;