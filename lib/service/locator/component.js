var Application = require('../../application/application');

function ComponentLocator() {
    this._type = 'com';
};

ComponentLocator.prototype.locate = function(identifier) {
    var app = Application.getApplication(identifier.getApplication());

    try {
        return require(app.config.component + '/' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
    } catch(error) {
        return false;
    }
};

module.exports = ComponentLocator;