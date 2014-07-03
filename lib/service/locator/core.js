function CoreLocator() {
    this._type = 'core';
};

CoreLocator.prototype.locate = function(identifier) {
    // This will try to locate files from the core.

    try {
        return require(__dirname + '/../../' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
    } catch (error) {
        return false;
    }
};

module.exports = CoreLocator;