var Locator = require('raddish-loader').Locator,
    util = require('util');

function ComponentLocator() {
    this._type = 'com';
}

util.inherits(ComponentLocator, Locator);

ComponentLocator.prototype.locate = function(identifier) {

};

module.exports = ComponentLocator;