'use strict';

/**
 * This is the main file.
 * This object holds the config and more data.
 *
 * @class Raddish
 */
var Application = require('../application/application'),
    http = require('http'),
    https = require('https'),
    threads = require('raddish-threads'),
    ObjectLoader = require('raddish-loader').Loader.getInstance(),
    RaddishDB = require('raddish-db'),
    started = false,
    Router = require('../router/router'),
    applicationQueue = [],
    instance = null;

class Raddish {
    constructor() {
        this.config = null;
        this.server = null;
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
        var path = identifier.split('.');

        return path.reduce(function(config, index) {
            return config[index] || false;
        }, this.config);
    }

    /**
     * This method will insert all the data for the related modules
     * All the data inserted is loaded from the config.json file.
     *
     * Usually this method isn't called manually, however if you want a specific method
     * to be executed before start you can do so.
     *
     * @method preStart
     * @param {Function} callback An optional callback for the preStart method.
     * @return {Raddish} The current object for chaining.
     */
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
     * @return {Raddish} The current object for chaining.
     */
    start(port) {
        port = port || this.getConfig('port');
        this.preStart();

        if(this.getConfig('threads')) {
            var threadsConfig = {};

            switch(typeof this.getConfig('threads')) {
                case 'object':
                    threadsConfig = this.getConfig('threads');
                    break;
                case 'number':
                    threadsConfig['threads'] = this.getConfig('threads');
            }

            threadsConfig['master'] = this.startMaster.bind(this, port);
            threadsConfig['worker'] = this.startWorker.bind(this, port);

            threads(threadsConfig);
        } else {
            this.startMaster(port);
            this.startWorker(port);
        }
        
        return this;
    }

    startMaster(port) {
        console.log('Raddish started on port: ' + port);
        if(this.getConfig('socketio')) {
            console.log('Socket.io started on port: ' + (this.getConfig('socketio.port') || 1338));
        }
    }

    startWorker(port) {
        if(this.server !== null) {
            console.log('Raddish already started.');
        }

        var ssl = this.getConfig('ssl'),
            server = null,
            fallback = false;

        port = port || this.getConfig('port');

        if(ssl && ssl.key && ssl.cert) {
            this.server = https.createServer({
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
        }

        if(fallback || server === null) {
            this.server = http.createServer(Router.route.bind(Router));
        }

        this.server.listen(port);

        if(applicationQueue.length > 0) {
            for(var application of applicationQueue) {
                this.registerApplication(application);
            }
        }
    }

    /**
     * Closes the HTTP or HTTPS connection.
     * @method stop
     */
    stop() {
        this.server.close();
        this.server = null;
    }

    /**
     * This method maked sure you will only and always have the single Raddish object.
     *
     * @method getInstance
     * @static
     * @return {*}
     */
    static getInstance() {
        if(instance === null) {
            instance = new Raddish();
        }

        return instance;
    }
}

module.exports = Raddish;