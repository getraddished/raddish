'use strict';

/**
 * This is the main file.
 * This object holds the config and more data.
 *
 * @class Raddish
 */
var ObjectLoader = require('raddish-loader').Loader.getInstance(),
    RaddishDB = require('raddish-db'),
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
            this.config = require(process.cwd() + '/raddish.json');
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

    middleware(req, res, next) {
        // Get the component file.
        var component = require(process.cwd() + '/components/' + req.params.component + '/' + req.params.component);
        return component(req, res)
            .then(function(data) {
                res.status(200);
                res.json({data: data.getData()});
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    /**
     * This method will setup raddish to work with ExpressJS.
     *
     * @param config
     *
     */
    static setup(config) {
        // Get the instance.
        // Do some preflight checks.
        var instance = this.getInstance()
            .setConfig(config);

        var sequence = instance.getConfig('sequence') || [
            '<Type>:<Package>.<Path>.<Name>',
            '<Type>:<Package>.<Path>.default',
            '<Type>:default.<Path>.<Name>',
            '<Type>:default.<Path>.default',
            'core:<Package>.<Path>.<Name>',
            'core:<Package>.<Path>.default',
            'core:<Path>.<Name>',
            'core:<Path>.default'
        ];

        RaddishDB.setConfig(instance.getConfig('database'));

        ObjectLoader.addLocator(__dirname + '/../object/locator/core');
        ObjectLoader.addLocator(__dirname + '/../object/locator/component');
        ObjectLoader.setSequence(sequence);

        return instance;
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