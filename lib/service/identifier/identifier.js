"use strict";

var Inflector   = require('../../inflector/inflector');
var url         = require('url');

/**
 * BaseIdentifier object which helps with the location of files and building identifiers
 *
 * @class BaseIdentifier
 * @since 28 March 2014
 * @param {String} identifier Identifier to convert to an object.
 * @constructor
 */
function ServiceIdentifier(identifier) {
    /**
     * Rewrite of the existing identifier package.
     *
     * It will now become url like: <type>://<application>/<path>
     */
    if(identifier.indexOf(':') == -1) {
        throw new RaddishError(500, 'Malformed identifier');
    }

    // We will parse our own identifiers.
    var parts = identifier.split(':');
    var _type = parts[0];

    parts = parts[1].replace('//', '').split('/');

    if(parts.length == 1) {
        var _application    = '';
        var _path           = parts[0].replace('/', '').split('.');
    } else {
        var _application    = parts[0];
        var _path           = parts[1].replace('/', '').split('.');
    }

    var _package        = _path.shift();
    var _name           = _path.pop();

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
        var string = '';

        if(_type) {
            string += _type + '://';
        }

        if(_application) {
            string += _application + '/';
        }

        if(_package) {
            string += _package + '.';
        }

        if(_path) {
            string += _path.join('.') + '.';
        }

        if(_name) {
            string += _name;
        }

        return string;
    }

    /**
     * Return the current type
     *
     * @method getType
     * @returns {String} Type of the current identifier.
     */
    this.getType = function() {
        return _type;
    }

    /**
     * Return the current application
     *
     * @method getApplication
     * @returns {String} Application name of the current identifier.
     */
    this.getApplication = function() {
        return _application;
    }

    /**
     * Return the current component
     *
     * @method getComponent
     * @returns {String} Component name of the current identifier.
     */
    this.getPackage = function() {
        return _package;
    }

    /**
     * Return the current path
     *
     * @method getPath
     * @returns {Array} path of the current identifier.
     */
    this.getPath = function() {
        return _path;
    }

    /**
     * Return the current name
     *
     * @method getName
     * @returns {String} Name of the current identifier.
     */
    this.getName = function() {
        return _name;
    }

    /**
     * Set the type of the current identifier
     *
     * @method setApplication
     * @param {String} newApplication The application name for the current identifier.
     */
    this.setType = function(newType) {
        _type = newType;

        return this;
    }

    /**
     * Set the application of the current identifier
     *
     * @method setApplication
     * @param {String} newApplication The application name for the current identifier.
     */
    this.setApplication = function(newApplication) {
        _application = newApplication;

        return this;
    }

    /**
     * Set the component of the current identifier
     *
     * @method setComponent
     * @param {String} component The component name for the current identifier.
     */
    this.setPackage = function(newPackage) {
        _package = newPackage;

        return this;
    }

    /**
     * Set the path of the current identifier
     *
     * @method setPath
     * @param {Array} path The path for the current identifier.
     */
    this.setPath = function(newPath) {
        _path = newPath;

        return this;
    }

    /**
     * Set the name for the current identifier
     *
     * @method setName
     * @param {String} name The name for the current identifier.
     */
    this.setName = function(newName) {
        _name = newName;

        return this;
    }
}

module.exports = ServiceIdentifier;