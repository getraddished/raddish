var Application = require('../../application/application');

/**
 * The ComponentLocator is part of the object loader,
 * this class is responsible for getting the file of a "com://..." identifier.
 *
 * @class ComponentLocator
 * @constructor
 */
function ComponentLocator() {
    this._type = 'com';
}

/**
 * This method will try to locate the file associated to the identifier,
 * if the file isn't found an error is returned,
 * when a dependency isn't found that error will be thrown.
 *
 * @method locate
 * @param {ObjectIdentifier} identifier The identifier of the file to load.
 * @returns {Boolean/ Object} An object when the file is found else false will be returned.
 */
ComponentLocator.prototype.locate = function(identifier) {
    var app = Application.getApplication(identifier.getApplication());

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