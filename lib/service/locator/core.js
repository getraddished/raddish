function CoreLocator() {
    this._type = 'core';
};

CoreLocator.prototype.locate = function() {
    // This will try to locate files from the core.
};

module.exports = CoreLocator;