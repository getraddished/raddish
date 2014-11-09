var fs          = Promise.promisifyAll(require('fs'));
var Inflector   = require('../inflector/inflector');

function Plugin() {
    this.plugins = [];
}

/**
 * This function will execute a function in the plugins.
 * This will bind the provided parameters to the function.
 *
 * @param {String} method The name of the function to execute
 * @param {Object} parameters The parameters to parse to the function.
 */
Plugin.prototype.execute = function(method) {
    var args        = Array.prototype.slice.call(arguments);
    // Shift off the first because that is the method name. We already have that one.
    args.shift();

    var functions   = [];
    var self        = this;
    method          = this.getMethod(method);

    // TODO: This part should be refactored to the #each() method of bluebird.
    return Promise.all(self.plugins)
        .then(function(plugins) {
            for(var index in plugins) {
                var plugin = plugins[index];

                if(typeof plugin[method] === 'function') {
                    functions.push(
                        Promise.cast(
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
 * This function will get the requested plugin(s).
 * The plugins are for a global system. Because the affect system behaviors.
 *
 * When the type has a "." in the name it is split.
 * First we will check if the single plugin exists which is path ( + name ) + name.
 * if this file doesn't exist then we will check all the files in the directory. (if it is a directory).
 *
 * then we will return everything (file or array).
 * Everything will be cast to a promise.
 *
 * @param path
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

    // TODO: This part has to be refactored.

    return Promise.cast(fs.existsSync(dir + '/' + name + '.js'))
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
            } else if(typeof exists.push == 'function') {
                return exists;
            } else {
                return fs.readdirAsync(dir);
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
        .catch(function(error) {
            console.log(error);

            return self;
        });
};

Plugin.prototype.getMethod = function(method) {
    var parts = method.split('.');
    parts = parts.map(function(value) {
        return Inflector.capitalize(value.toLowerCase());
    });

    return 'on' + parts.join('');
};

module.exports = Plugin;