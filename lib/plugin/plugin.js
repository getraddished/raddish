'use strict';

var Inflector = require('raddish-inflector'),
    fs = require('fs');

class Plugin {
    /**
     * The execute method will execute the found plugins with the supplied method.
     * This is only done when there is a plugin folder defined, when there is none defined it will be skipped.
     *
     * @param {String} identifier A dot-separate identifier.
     * @param {String} method A dot-separated method identifier.
     * @return {Promise} A resolved promise when all the plugin methods are executed.
     */
    execute(identifier, method, ...args) {
        var plugins = this.findPlugins(identifier),
            funct = 'on' + method.split('.').map(function(value) {
                return Inflector.capitalize(value);
            }).join('');

        if(!plugins) {
            return Promise.resolve();
        }

        for(var plugin of plugins) {
            if(typeof plugin[funct] === 'function') {
                plugin[funct].apply(plugin, args);
            }
        }

        return this;
    }

    /**
     * This method will return all the plugins found in a folder.
     *
     * @param {String} identifier A dot-separated identifier for plugin types.
     * @returns {Array/ False} False when there is an error, and an array with the found plugins.
     */
    findPlugins(identifier) {
        var Raddish = require('./../raddish/raddish').getInstance(),
            root = (Raddish.getConfig('plugin') || false);

        try {
            var path = process.cwd() + root + '/' + identifier.replace('.', '/'),
                stat = fs.statSync(path),
                plugins = [];

            var files = fs.readdirSync(path);
            for (var file of files) {
                if (['.', '..'].indexOf(file) >= 0) {
                    continue;
                }

                var Plugin = require(path + '/' + file),
                    plugin = new Plugin();

                plugins.push(plugin);
            }

            return plugins;
        } catch(error) {
            return [];
        }
    }
}

module.exports = new Plugin();