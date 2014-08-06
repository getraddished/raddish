function CoreLocator() {
    this._type = 'core';
    this._base = __dirname + '/../../';
}

CoreLocator.prototype.locate = function(identifier) {
    try {
        return require(this._base + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
    } catch (error) {
        if(!error.message.match(this._base)) {
            throw new RaddishError(500, error.message);
        }
        
        return false;
    }
};

module.exports = CoreLocator;