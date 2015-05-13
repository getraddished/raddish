/**
 * The CoreLocator is also part of the ObjectLoader
 * but this objects responsibility is to load core files.
 *
 * @class CoreLocator
 * @constructor
 */
function CoreLocator() {
    this._type = 'core';
    this._base = __dirname + '/../../';
}

/**
 * This method will try to locate the core file associated to a "core:..." identifier.
 * If the file is found its containing object is returned,
 * else a false will be returned but when a dependency isn't found the error will be thrown.
 *
 * @method locate
 * @param {ObjectIdentifier} identifier The identifier of the file to load.
 * @returns {Boolean/ Object} An object when the file is found else false will be returned.
 */
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