var Inflector   = require('../../inflector/inflector');

/**
 * BaseIdentifier object which helps with the location of files and building identifiers
 *
 * @class BaseIdentifier
 * @since 28 March 2014
 * @param {String} identifier Identifier to convert to an object.
 * @constructor
 */
function BaseIdentifier(identifier) {
    var parts = identifier.split(':');
    var pathparts = parts[1].split('.');

    this.application = parts[0];
    this.component = pathparts.shift();
    this.name = pathparts.pop();
    this.path = pathparts;
}

/**
 * Get the path of the file of the current identifier.
 *
 * @method getFilePath
 * @returns {string} Path to the file of the identifier
 */
BaseIdentifier.prototype.getFilePath = function () {
    var Application = require('../../application/application');

    // These files will be loaded relative to the loader.
    // So we need to go some levels up.
    if (this.application === 'core') {
        return __dirname + '/../../' + this.component + '/' + this.path.join('/') + '/' + this.name;
    }

    return Application.getApplication(this.application).config.componentFolder + '/' + this.component + '/' + this.path.join('/') + '/' + this.name;
};

/**
 * Return a new instance of the current identifier.
 *
 * @method clone
 * @returns {BaseIdentifier} A cloned identifier.
 */
BaseIdentifier.prototype.clone = function () {
    return new BaseIdentifier(this.toString());
};

/**
 * Recreate the identifier given to the Object.
 *
 * @method toString
 * @returns {string} The recreated identifier string given to the current object.
 */
BaseIdentifier.prototype.toString = function () {
    return this.application + ':' + this.component + '.' + this.path.join('.') + '.' + this.name;
};

/**
 * Return the current application
 *
 * @method getApplication
 * @returns {String} Application name of the current identifier.
 */
BaseIdentifier.prototype.getApplication = function () {
    return this.application;
};

/**
 * Return the current component
 *
 * @method getComponent
 * @returns {String} Component name of the current identifier.
 */
BaseIdentifier.prototype.getComponent = function () {
    return this.component;
};

/**
 * Return the current path
 *
 * @method getPath
 * @returns {Array} path of the current identifier.
 */
BaseIdentifier.prototype.getPath = function () {
    return this.path;
};

/**
 * Return the current type
 *
 * @method getType
 * @returns {String} Type of the current identifier.
 */
BaseIdentifier.prototype.getType = function () {
    if(this.path[this.path.length - 1] == undefined) {
        return this.component;
    } else {
        return this.path[this.path.length - 1];
    }
};

/**
 * Return the current name
 *
 * @method getName
 * @returns {String} Name of the current identifier.
 */
BaseIdentifier.prototype.getName = function () {
    return this.name;
};

/**
 * Set the application of the current identifier
 *
 * @method setApplication
 * @param {String} application The application name for the current identifier.
 */
BaseIdentifier.prototype.setApplication = function (application) {
    this.application = application;

    return this;
};

/**
 * Set the component of the current identifier
 *
 * @method setComponent
 * @param {String} component The component name for the current identifier.
 */
BaseIdentifier.prototype.setComponent = function (component) {
    this.component = component;

    return this;
};

/**
 * Set the path of the current identifier
 *
 * @method setPath
 * @param {Array} path The path for the current identifier.
 */
BaseIdentifier.prototype.setPath = function (path) {
    this.path = path;

    return this;
};

/**
 * Set the name for the current identifier
 *
 * @method setName
 * @param {String} name The name for the current identifier.
 */
BaseIdentifier.prototype.setName = function (name) {
    this.name = name;

    return this;
};

module.exports = BaseIdentifier;