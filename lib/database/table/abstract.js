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
    method = method.toLowerCase();

    if(this.methods.indexOf(method) == -1) {
        throw new RaddishError(500, 'method is not supported');
    }

    if(Raddish.getConfig('stream')) {
        return this.executeStream(method, context);
    }
};

TableAbstract.prototype.executeStream = function(method, context) {

};

module.exports = TableAbstract;