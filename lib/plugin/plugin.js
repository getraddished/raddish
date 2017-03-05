'use strict';

var Inflector = require('raddish-inflector'),
    fs = require('fs');

/**
 * The plugin class will hold and load the required plugins, ready to be executed on demand.
 *
 * @class Plugin
 */
class Plugin {
    /**
     * The execute method will execute the found plugins with the supplied method.
     * This is only done when there is a plugin folder defined, when there is none defined it will be skipped.
     *
     * @method execute
     * @param {String} identifier A dot-separate identifier.
     * @param {String} method A dot-separated method identifier.
     * @return {Promise} A resolved promise when all the plugin methods are executed.
     */
    execute() {
        var args = Array.prototype.splice.call(arguments, 0),
            identifier = args.shift(),
            method = args.shift(),
            plugins = this.findPlugins(identifier),
            funct = 'on' + method.split('.').map(function(value) {
                return Inflector.capitalize(value);
            }).join(''),
            promises = [];

        if(!plugins) {
            return Promise.resolve();
        }

        for(var plugin of plugins) {
            if(typeof plugin[funct] === 'function') {
                promises.push(plugin[funct].apply(plugin, args));
            }
        }

        return Promise.all(promises);
    }

    /**
     * This method will return all the plugins found in a folder.
     *
     * @method findPlugin
     * @param {String} identifier A dot-separated identifier for plugin types.
     * @returns {Array/ False} False when there is an error, and an array with the found plugins.
     */
    findPlugins(identifier) {
        var Raddish = require('./../raddish/raddish').getInstance(),
            root = (Raddish.getConfig('plugin') || false),
            path = '',
            plugins = [],
            files = [];

        try {
            path = process.cwd() + root + '/' + identifier.replace('.', '/');
            files = fs.readdirSync(path);

            for (var file of files) {
                if (['.', '..'].indexOf(file) >= 0) {
                    continue;
                }

                plugins.push(new (require(path + '/' + file))());
            }

            return plugins;
        } catch(error) {
            return [];
        }
    }
}

module.exports = new Plugin();