var Inflector   = require('../../inflector/inflector');

function BaseIdentifier(identifier) {
    var parts = identifier.split(':');
    var pathparts = parts[1].split('.');

    this.application = parts[0];
    this.component = pathparts.shift();
    this.name = pathparts.pop();
    this.path = pathparts;
}

BaseIdentifier.prototype.getFilePath = function () {
    // These files will be loaded relative to the loader.
    // So we need to go some levels up.
    if (this.application === 'core') {
        return __dirname + '/../../' + this.path.join('/') + '/' + this.name;
    }
    return process.cwd() + '/applications/' + this.application + '/components/' + this.component + '/' + this.path.join('/') + '/' + this.name;
};

BaseIdentifier.prototype.clone = function () {
    return new BaseIdentifier(this.toString());
};

BaseIdentifier.prototype.toString = function () {
    return this.application + ':' + this.component + '.' + this.path.join('.') + '.' + this.name;
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

BaseIdentifier.prototype.getType = function () {
    return this.path[this.path.length - 1];
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