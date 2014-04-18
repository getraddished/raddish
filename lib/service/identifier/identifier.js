var Inflector   = require('../../inflector/inflector');

/**
 * BaseIdentifier object which helps with the location of files and building identifiers
 *
 * @class BaseIdentifier
 * @since 28 March 2014
 * @param {String} identifier Identifier to convert to an object.
 * @constructor
 */
function ServiceIdentifier(identifier) {
    var parts = identifier.split(':');
    var pathparts = parts[1].split('.');

    var application = parts[0];
    var component = pathparts.shift();
    var name = pathparts.pop();
    var path = pathparts;

    /**
     * Get the path of the file of the current identifier.
     *
     * @method getFilePath
     * @returns {string} Path to the file of the identifier
     */
    this.getFilePath = function() {
        var Application = require('../../application/application');

        // These files will be loaded relative to the loader.
        // So we need to go some levels up.
        if (application === 'core') {
            return __dirname + '/../../' + component + '/' + path.join('/') + '/' + name;
        }

        return Application.getApplication(application).config.componentFolder + '/' + component + '/' + path.join('/') + '/' + name;
    }

    /**
     * Return a new instance of the current identifier.
     *
     * @method clone
     * @returns {BaseIdentifier} A cloned identifier.
     */
    this.clone = function() {
        return new ServiceIdentifier(this.toString());
    }

    /**
     * Recreate the identifier given to the Object.
     *
     * @method toString
     * @returns {string} The recreated identifier string given to the current object.
     */
    this.toString = function() {
        return application + ':' + component + '.' + path.join('.') + '.' + name;
    }

    /**
     * Return the current application
     *
     * @method getApplication
     * @returns {String} Application name of the current identifier.
     */
    this.getApplication = function() {
        return application;
    }

    /**
     * Return the current component
     *
     * @method getComponent
     * @returns {String} Component name of the current identifier.
     */
    this.getComponent = function() {
        return component;
    }

    /**
     * Return the current path
     *
     * @method getPath
     * @returns {Array} path of the current identifier.
     */
    this.getPath = function() {
        return path;
    }

    /**
     * Return the current type
     *
     * @method getType
     * @returns {String} Type of the current identifier.
     */
    this.getType = function() {
        if(path[path.length - 1] == undefined) {
            return component;
        } else {
            return path[path.length - 1];
        }
    }

    /**
     * Return the current name
     *
     * @method getName
     * @returns {String} Name of the current identifier.
     */
    this.getName = function() {
        return name;
    }

    /**
     * Set the application of the current identifier
     *
     * @method setApplication
     * @param {String} newApplication The application name for the current identifier.
     */
    this.setApplication = function(newApplication) {
        application = newApplication;

        return this;
    }

    /**
     * Set the component of the current identifier
     *
     * @method setComponent
     * @param {String} component The component name for the current identifier.
     */
    this.setComponent = function(newComponent) {
        component = newComponent;

        return this;
    }

    /**
     * Set the path of the current identifier
     *
     * @method setPath
     * @param {Array} path The path for the current identifier.
     */
    this.setPath = function(newPath) {
        path = newPath;

        return this;
    }

    /**
     * Set the name for the current identifier
     *
     * @method setName
     * @param {String} name The name for the current identifier.
     */
    this.setName = function(newName) {
        name = newName;

        return this;
    }
}

module.exports = ServiceIdentifier;