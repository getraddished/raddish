"use strict";

/**
 * This is a simple adapter for error logging.
 * This object will get the specified logging adapter and set it,
 * if the adapter is invalid it will fallback to the console adapter, logging everything to the console.
 *
 * @param {Number} code The code of the error
 * @param {String} message The error message
 * @constructor
 */
function Log(code, message) {
    var logging     = Raddish.getConfig('logging');
    var identifier  = ((logging && logging.adapter) ? logging.adapter.indexOf(':') > -1 : false) ? logging.adapter : 'core:log.adapter.' + (logging.adapter ? logging.adapter : 'console');

    this.adapter    = this.getAdapter(identifier, logging.options);
    this.adapter.log(code, message);
}

/**
 * The function which will check the adapter, and return it,
 * if defined, when an error occures it will fallback to the console adapter.
 *
 * @param {ObjectIdentifier} adapter The identifier of the adapter
 * @param {Object} options The config variables for the adapter
 * @returns {Object} The logging adapter
 */
Log.prototype.getAdapter = function(adapter, options) {
    if(typeof this.adapter === 'object') {
        return this.adapter;
    } else {
        var Object = {};

        try {
            Object = ObjectLoader.require(adapter);
            if(Object === false) {
                throw new Error('Adapter identifier "' + adapter + '" is faulty!');
            }
            return new Object(options);
        } catch(error) {
            // When an error is thrown show it in the console.
            console.log(error);

            // Then fallback to console.
            Object = require('./adapter/console');
            return new Object(options);
        }
    }
};

module.exports = Log;