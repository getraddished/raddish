var fs          = require('fs'),
    Inflector   = require('../inflector/inflector'),
    plugin;

/**
 * Plugin object which will discover and run specific plugins.
 *
 * @class Plugin
 * @constructor
 */
function Plugin() {
    this.plugins = [];
}

/**
 * This function will execute a function in the plugins.
 * This will bind the provided parameters to the function.
 *
 * @method execute
 * @param {String} method The name of the function to execute
 * @return {Object} The plugin object itself, used to run more plugins.
 */
Plugin.prototype.execute = function(method) {
    var args        = Array.prototype.slice.call(arguments);
    args.shift();

    var functions   = [];
    var self        = this;
    method          = this.getMethod(method);

    return Promise.all(self.plugins)
        .then(function(plugins) {
            for(var index in plugins) {
                plugin = plugins[index];

                if(typeof plugin[method] === 'function') {
                    functions.push(
                        Promise.resolve(
                            plugin[method].apply(this, args)
                        )
                    );
                }
            }

            return Promise.all(functions);
        })
        .then(function() {
            return self;
        })
        .catch(function() {
            return self;
        });
};



/**
 * This method will get the requested plugin(s).
 * The plugins are for a global system. Because the affect system behaviors.
 *
 * When the type has a "." in the name it is split.
 * First we will check if the single plugin exists which is path ( + name ) + name.
 * if this file doesn't exist then we will check all the files in the directory. (if it is a directory).
 *
 * then we will return everything (file or array).
 * Everything will be cast to a promise.
 *
 * @method get
 * @param {String} type The type of plugins to receive.
 * @returns {Array}
 */
Plugin.prototype.get = function(type) {
    var path    = [];
    var name    = '';
    var self    = this;

    // If there is a dot in the type, I have to check if there is a file located with the last part of the type.
    // If there isn't we have subdirectories. And we will return everything.
    // This will rely on fs and require.
    if(type.indexOf('.') > -1) {
        path = type.split('.');
        name = path.pop();
    } else {
        name = type;
    }

    var dir = process.cwd() + Raddish.getConfig('plugins') + '/';
    if(path.length > 0) {
        dir += path.join('/') + '/';
    }
    dir += name;

    return Promise.resolve(fs.existsSync(dir + '/' + name + '.js'))
        .then(function(exists) {
            if(exists) {
                var Obj = require(dir + '/' + name);
                self.plugins.push(new Obj());

                return self.plugins;
            } else {
                return fs.existsSync(dir + '.js');
            }
        })
        .then(function(exists) {
            if(exists === true) {
                var Obj = require(dir);
                self.plugins.push(new Obj());

                return self.plugins;
            } else if(typeof exists.push === 'function') {
                return exists;
            } else {
                if(fs.existsSync(dir)) {
                    return fs.readdirSync(dir);
                } else {
                    return false;
                }
            }
        })
        .then(function(files) {
            if(typeof files[0] != 'string') {
                return files;
            }

            for(var index in files) {
                var name = files[index];
                var file = fs.statSync(dir + '/' + files[index]);

                if(!file.isDirectory() && fs.existsSync(dir + '/' + name)) {
                    var Obj = require(dir + '/' + name);
                    self.plugins.push(new Obj());
                }
            }

            return self.plugins;
        })
        .then(function() {
            return self;
        })
        .catch(function() {
            return self;
        });
};

/**
 * This method converts the dot-separated method name to a camelcased method
 *
 * @param {String} method The dot-separated method name
 * @returns {string} The camelcased method name.
 */
Plugin.prototype.getMethod = function(method) {
    var parts = method.split('.');
    parts = parts.map(function(value) {
        return Inflector.capitalize(value.toLowerCase());
    });

    return 'on' + parts.join('');
};

module.exports = Plugin;
