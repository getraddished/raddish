var Abstract = require('./abstract');
var util = require('util');
var Inflector = require('../../../inflector/inflector');

function Socketable() {
    Abstract.call(this);
};

util.inherits(Socketable, Abstract);

Socketable.prototype.onAfterInsert = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getComponent();
    var name = identifier.getName();

    string = string + '.' + Inflector.pluralize(name);
    Socket.io.to(string).emit('new', context.data.getData());

    return Promise.resolve(context);
};

Socketable.prototype.onAfterUpdate = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getComponent();
    var name = identifier.getName();

    var SingleString = string + '.' + Inflector.singularize(name) + '.' + context.data.data.id;
    var PluralString = string + '.' + Inflector.pluralize(name);

    Socket.io.to(SingleString).emit('edit', context.data.getData());
    Socket.io.to(PluralString).emit('edit', context.data.getData());

    return Promise.resolve(context);
};

Socketable.prototype.onAfterDelete = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getComponent();
    var name = identifier.getName();

    var SingleString = string + '.' + Inflector.singularize(name) + '.' + context.data.data.id;
    var PluralString = string + '.' + Inflector.pluralize(name);

    Socket.io.to(SingleString).emit('delete', context.result.getData());
    Socket.io.to(PluralString).emit('delete', context.result.getData());

    return Promise.resolve(context);
};

module.exports = Socketable;