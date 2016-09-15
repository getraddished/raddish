var Inflector = require('raddish-inflector'),
    fs = require('fs');

function Plugin() {
}

/**
 * The execute method will execute the found plugins with the supplied method.
 * This is only done when there is a plugin folder defined, when there is none defined it will be skipped.
 *
 * @param {String} identifier A dot-separate identifier.
 * @param {String} method A dot-separated method identifier.
 * @return {Promise} A resolved promise when all the plugin methods are executed.
 */
Plugin.prototype.execute = function() {
    var args = Array.prototype.slice.call(arguments),
        plugins = this.findPlugins(args.shift()),
        parts = args.shift().split('.').map(function(value) {
            return Inflector.capitalize(value);
        }),
        funct = 'on' + parts.join('');

    if(!plugins) {
        return Promise.resolve();
    }

    for(var index in plugins) {
        if(plugins.hasOwnProperty(index)) {
            var plugin = plugins[index];

            if(typeof plugins[funct] === 'function') {
                plugins[funct]();
            }
        }
    }

    return this;
};

/**
 * This method will return all the plugins found in a folder.
 *
 * @param {String} identifier A dot-separated identifier for plugin types.
 * @returns {Array/ False} False when there is an error, and an array with the found plugins.
 */
Plugin.prototype.findPlugins = function(identifier) {
    var Raddish = require('./../raddish/raddish');
    var root = (Raddish.getConfig('plugin') || false);

    try {
        var path = process.cwd() + root + '/' + identifier.replace('.', '/'),
            stat = fs.statSync(path),
            plugins = [];

        var files = fs.readdirSync(path);
        for (var index in files) {
            if (files.hasOwnProperty(index)) {
                var file = files[index];

                if (['.', '..'].indexOf(file) >= 0) {
                    continue;
                }

                var Plugin = require(path + '/' + file),
                    plugin = new Plugin();

                plugins.push(plugin);
            }
        }

        return plugins;
    } catch(error) {
        return [];
    }
};

module.exports = new Plugin();