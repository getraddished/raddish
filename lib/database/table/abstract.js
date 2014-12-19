var ObjectManager   = require('../../object/manager');
var util            = require('util');
var Inflector       = require('../../inflector/inflector');

function TableAbstract(config) {
    ObjectManager.call(this, config);

    this.methods = ['select', 'insert', 'update', 'delete'];
}

util.inherits(TableAbstract, ObjectManager);

/**
 * This method will execute a certain command combined with a context.
 * This method will also call specialized for the selected method.
 * The methods callable are: Select, Insert, Update and Delete.
 *
 * @param {String} method The method to execute.
 * @param {CommandContext} context The context object to use in this call.
 */
TableAbstract.prototype.execute = function(method, context) {
    var self = this;
    method = method.toLowerCase();

    if(this.methods.indexOf(method) == -1) {
        throw new RaddishError(500, 'method is not supported');
    }

    return this.getCommandChain()
        .then(function(chain) {
            return [chain, chain.run('initialize.' + method, context)];
        })
        .spread(function(chain, context) {
            return chain.run('before.' + method, context);
        })
        .then(function(context) {
            return self['_before' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return [self.getAdapter(), context];
        })
        .spread(function(adapter, context) {
            return adapter.execute(context.query);
        })
        .then(function(data) {
            context.result = data;

            return [self.getCommandChain(), self['_after' + Inflector.capitalize(method)](context)];
        })
        .spread(function(chain, context) {
            return chain.run('after.' + method, context);
        })
        .then(function(context) {
            return context.result;
        });
};

TableAbstract.prototype._beforeSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

module.exports = TableAbstract;