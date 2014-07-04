var Application = require('../../application/application');

function PluginLocator() {
    this._type = 'plg';
};

PluginLocator.prototype.locate = function(identifier) {
    var app = Application.getApplication(identifier.getApplication());

    try {
        return require(app.config.plugin + '/' + identifier.getPackage() + '/' + identifier.getPath().join('/') + '/' + identifier.getName());
    } catch(error) {
        return false;
    }
};

module.exports = PluginLocator;