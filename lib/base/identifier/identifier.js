var url         = require('url');
var Inflector   = require('../../inflector/inflector');

function BaseIdentifier(identifier) {
    var parts = url.parse(identifier, true);

    if (parts.pathname) {
        var pathname = parts.pathname.replace('/', '');
        var pathparts = pathname.split('.');
    }

    this.name = pathparts.pop();
    this.path = pathparts;
    this.component = parts.hostname;
    this.application = parts.protocol.replace(':', '');
}

BaseIdentifier.prototype.getFilePath = function () {
    return process.cwd() + '/applications/' + this.application + '/components/' + this.component + '/' + this.path.join('/') + '/' + this.name;
};

BaseIdentifier.prototype.clone = function () {
    return new BaseIdentifier(this.toString());
};

BaseIdentifier.prototype.toString = function () {
    return this.application + '://' + this.component + '/' + this.path.join('.') + '.' + this.name;
};

BaseIdentifier.prototype.getApplication = function () {
    return this.application;
};

BaseIdentifier.prototype.getComponent = function () {
    return this.component;
};

BaseIdentifier.prototype.getPath = function () {
    return this.path;
};

BaseIdentifier.prototype.getName = function () {
    return this.name;
};

BaseIdentifier.prototype.setApplication = function (application) {
    this.application = application;

    return this;
};

BaseIdentifier.prototype.setComponent = function (component) {
    this.component = component;

    return this;
};

BaseIdentifier.prototype.setPath = function (path) {
    this.path = path;

    return this;
};

BaseIdentifier.prototype.setName = function (name) {
    this.name = name;

    return this;
};

module.exports = BaseIdentifier;