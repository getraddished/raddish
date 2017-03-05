'use strict';

var Locator = require('raddish-loader').Locator,
    Application = require('../../application/application');

/**
 * The component locator is called when searching for a "com://" identifier.
 *
 * @class ComponentLocator
 * @extends Locator
 */
class ComponentLocator extends Locator {
    constructor() {
        super('com');
    }

    /**
     * This method will try to locate the file belonging to the identifier.
     * When it isn't found false is returned.
     *
     * @param {Identifier} identifier The identifier of the file to locate.
     * @return {Object|Boolean} An object when the file is found, false otherwise.
     */
    locate(identifier) {
        var app = Application.findApplication(identifier.getApplication());

        try {
            return require(app.config.component + '/' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
        } catch(error) {
            if(!error.message.match(app.config.component)) {
                throw new Error(error.message);
            }

            return false;
        }
    }
}

module.exports = ComponentLocator;