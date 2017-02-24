'use strict';

/**
 * This is the main file.
 * This object holds the config and more data.
 */
var Application = require('../application/application'),
    http = require('http'),
    https = require('https'),
    cluster = new (require('raddish-threads')),
    SocketIO = require('socket.io'),
    ObjectLoader = require('raddish-loader').Loader.getInstance(),
    RaddishDB = require('raddish-db'),
    started = false,
    Router = require('../router/router'),
    applicationQueue = [],
    instance = null;

class Raddish {
    constructor() {
        this.config = null;
    }

    /**
     * This method sets the config and all of its values.
     *
     * @method setConfig
     * @param {String/ Object/ undefined} conf The optional config for Raddish.
     * @returns {Raddish} the current object for chaining.
     */
    setConfig(config) {
        if(typeof config == 'string') {
            this.config = require(config);
        } else if(typeof config == 'object') {
            this.config = config;
        } else {
            this.config = require(process.cwd() + '/config.json');
        }

        return this;
    }

    /**
     * This method returns the value of the config. When no identifier is given
     * the complete config is returned.
     *
     * When a part of the identifier isn't found in the config false will be returned.
     *
     * @method getConfig
     * @param {String/null} identifier The dot-separated identifier of the config value.
     * @returns {*} The data found in the config.
     */
    getConfig(identifier) {
        if(this.config === null) {
            return false;
        }

        if(!identifier) {
            return this.config;
        }

        if(identifier.indexOf('.') === -1) {
            return this.config[identifier] || false;
        }

        var parts = identifier.split('.'),
            base = this.config;

        for(var part of parts) {
            if(!base[part]) {
                return false;
            }

            base = base[part];
        }

        return base;
    }

    preStart(callback) {
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

        RaddishDB.setConfig(this.getConfig('database'));

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
     * @method registerApplication
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
     * @method start
     * @param {int} port The optional port number.
     */
    start(port) {
        this.preStart();

        var ssl = this.getConfig('ssl'),
            server = null,
            fallback = false,
            self = this;

        port = port || this.getConfig('port');

        if(this.getConfig('threads') && cluster.isMaster) {
            cluster.start();

            if(this.getConfig('socketio')) {
                console.log('Socket.io started on port: ' + (this.getConfig('socketio.port') || 1338));
            }
        } else {
            if(ssl && ssl.key && ssl.cert) {
                server = https.createServer({
                    key: ssl.key,
                    cert: ssl.cert
                }, Router.route.bind(Router));
            } else {
                if(ssl) {
                    fallback = true;
                    console.log('There is an error with the ssl settings!');
                    console.log('Falling back to http!');
                }
            }

            if(this.getConfig('socketio')) {
                require('../socket/socket').start(this.getConfig('socketio.port') || 1338);

                if(!this.getConfig('threads')) {
                    console.log('Socket.io started on port: ' + (this.getConfig('socketio.port') || 1338));
                }
            }

            if(fallback || server === null) {
                server = http.createServer(Router.route.bind(Router));
            }

            server.listen(port, function() {
                if(!self.getConfig('threads')) {
                    console.log('Raddish started on port: ' + port);
                }
            });
        }

        if(applicationQueue.length > 0) {
            for(var application of applicationQueue) {
                this.registerApplication(application);
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