'use strict';

var Locator = require('raddish-loader').Locator;

/**
 * The component locator is called when searching for a "core:" identifier.
 *
 * @class CoreLocator
 * @extends Locator
 */
class CoreLocator extends Locator {
    constructor() {
        super('core');
        this._base = __dirname + '/../../';
    }

    /**
     * This method will try to locate the file belonging to the identifier.
     * When it isn't found false is returned.
     *
     * @param {Identifier} identifier The identifier of the file to locate.
     * @return {Object|Boolean} An object when the file is found, false otherwise.
     */
    locate(identifier) {
        try {
            return require(this._base + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
        } catch (error) {
            return false;
        }
    }
}

module.exports = CoreLocator;