'use strict';

var Locator = require('raddish-loader').Locator,
    Application = require('../../application/application');

class ComponentLocator extends Locator {
    constructor() {
        super('com');
    }

    locate(identifier) {
        var app = Application.findApplication(identifier.getApplication());

        try {
            return require(app.config.component + '/' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
        } catch(error) {
            if(!error.message.match(app.config.component)) {
                throw new RaddishError(500, error.message);
            }

            return false;
        }
    }
}

module.exports = ComponentLocator;