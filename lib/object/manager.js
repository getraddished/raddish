'use strict';

var Loader = require('raddish-loader').Loader.getInstance(),
    clone = require('clone'),
    Identifier = require('raddish-loader').Identifier,
    Application = require('../application/application'),
    Inflector = require('raddish-inflector'),
    CommandChain = require('../command/chain');

class ObjectManager {
    constructor(config) {
        this.config = {};
        this.identifier = config.identifier;
        this.commandChain = null;
    }

    _initialize(config) {
        this.config = config;
        this.commandChain = new CommandChain(this, config.behaviors);

        return Promise.resolve(this);
    }

    getIdentifier() {
        return this.identifier;
    }

    getCommandChain() {
        return this.commandChain;
    }

    clone() {
        return clone(this, false, 4);
    }

    /**
     * The execute method executes a method against the command chain.
     *
     * @param method The method to execute
     * @param context A simple object to act as the basic context.
     */
    execute(method, context) {
        var chain = this.getCommandChain(),
            self = this;

        return chain.execute('initialize.' + method, context)
            .then(function() {
                return chain.execute('before.' + method, context);
            })
            .then(function() {
                return self['_action' + Inflector.capitalize(method)](context)
                    .then(function(result) {
                        context.result = result;
                        return self.getCommandChain();
                    });
            })
            .then(function(chain) {
                return chain.execute('after.' + method, context);
            })
            .then(function() {
                return context.result;
            });
    }

    getObject(identifier, config) {
        config = config || {};

        var conf = {};
        Object.keys(config).sort().forEach(function(key) {
            conf[key] = config[key];
        });

        var config_identifier = JSON.stringify(conf);
        if((object = Loader.getCache(identifier + '.' + config_identifier)) !== false) {
            return Promise.resolve(clone(object, false, 4));
        }

        var Obj = Loader.require(identifier),
            object = new Obj({
                identifier: new Identifier(identifier)
            });

        config = this._getComponentConfig(identifier, config);
        var promise = (typeof object['_initialize'] == 'function' ? object._initialize(config) : Promise.resolve(object));
        return promise
            .then(function(object) {
                Loader.removeCache(identifier);
                Loader.addCache(identifier + '.' + config_identifier, object);

                return clone(object, false, 4);
            });
    }

    _getComponentConfig(identifier, config) {
        function findConfig(identifier, config) {
            var base = config,
                path = identifier.getPath();

            for(var part of path) {
                if(!base[part]) {
                    return false
                }

                base = base[part];
            }

            if(base[identifier.getName()]) {
                return base[identifier.getName()];
            }

            return false;
        }

        var ident = new Identifier(identifier),
            conf = Application.findApplication(ident.getApplication())._getComponentConfig(ident.getPackage()),
            component = Application.findApplication(ident.getApplication()).config.component + '/' + ident.getPackage() + '/config.json';

        conf = findConfig(ident, conf) || {};

        try {
            component = findConfig(ident, require(component)) || false;
        } catch(err) {
            component = false;
        }

        if(component) {
            Object.assign(conf, component);
        }

        // TODO: Check this line.
        for(var index in component) {
            Object.assign(conf, config);
        }
        
        return conf;
    }

    static get() {
        return ObjectManager.prototype.getObject.apply(ObjectManager.prototype, arguments);
    }
}

module.exports = ObjectManager;