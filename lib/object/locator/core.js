var Locator = require('raddish-loader').Locator,
    util = require('util');

function CoreLocator() {
    this._type = 'core'
}

util.inherits(CoreLocator, Locator);

CoreLocator.prototype.locate = function(identifier) {

};

module.exports = CoreLocator;