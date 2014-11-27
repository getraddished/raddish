var Abstract    = require('../../../command/behavior/behavior');
var util        = require('util');
var Inflector   = require('../../../inflector/inflector');

/**
 * The socketable behavior will automatically send the changes to the sockets of the connected clients.
 *
 * @param {Object} config The config object
 * @constructor
 */
function Socketable(config) {
    Abstract.call(this, config);
};

util.inherits(Socketable, Abstract);

Socketable.prototype.onAfterInsert = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getPackage();
    var name = identifier.getName();

    string = string + '.' + Inflector.pluralize(name);
    Socket.io.to(string).emit('new', context.data.getData());

    return Promise.resolve(context);
};

Socketable.prototype.onAfterUpdate = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getPackage();
    var name = identifier.getName();

    var SingleString = string + '.' + Inflector.singularize(name) + '.' + context.data.data.id;
    var PluralString = string + '.' + Inflector.pluralize(name);

    Socket.io.to(SingleString).emit('edit', context.data.getData());
    Socket.io.to(PluralString).emit('edit', context.data.getData());

    return Promise.resolve(context);
};

Socketable.prototype.onAfterDelete = function(context) {
    var identifier = context.caller.getIdentifier().clone();
    var string = identifier.getApplication() + ':' + identifier.getPackage();
    var name = identifier.getName();

    var SingleString = string + '.' + Inflector.singularize(name) + '.' + context.data.data.id;
    var PluralString = string + '.' + Inflector.pluralize(name);

    Socket.io.to(SingleString).emit('delete', context.data.getData());
    Socket.io.to(PluralString).emit('delete', context.data.getData());

    return Promise.resolve(context);
};

module.exports = Socketable;