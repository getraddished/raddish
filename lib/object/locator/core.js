'use strict';

var Locator = require('raddish-loader').Locator;

class CoreLocator extends Locator {
    constructor() {
        super('core');
        this._base = __dirname + '/../../';
    }

    locate(identifier) {
        try {
            return require(this._base + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
        } catch (error) {
            return false;
        }
    }
}

module.exports = CoreLocator;