var Locator = require('raddish-loader').Locator,
    util = require('util'),
    Application = require('../../application/application');

function ComponentLocator() {
    this._type = 'com';
}

util.inherits(ComponentLocator, Locator);

ComponentLocator.prototype.locate = function(identifier) {
    var app = Application.findApplication(identifier.getApplication());

    try {
        return require(app.config.component + '/' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
    } catch(error) {
        if(!error.message.match(app.config.component)) {
            throw new RaddishError(500, error.message);
        }

        return false;
    }
};

module.exports = ComponentLocator;