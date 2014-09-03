/**
 * This will be a concept behavior
 * As is known a context has a predefined set of roles and are only for that context.
 *
 * These will be used in a context (behavior).
 * The context will be an intent/ user model for an operation.
 *
 * In this concept we will handle a bank transaction.
 * We have a small issue because that everything inside of the initialize is cached as well so
 * we can't define specific data in the initialize function.
 *
 * Next to that we don't have the context in the initialize function.
 * So in fact we need to have a special function that will be called before the calling of a method.
 */
var util        = require('util');
var Behavior    = ObjectLoader.require('core:command.behavior.behavior');

function Transactionable(config) {
    Behavior.call(this, config);

    this.registerMethod('initialize.get', this.initializeGet);
}

util.inherits(Transactionable, Behavior);

/**
 * The onInitializeGet method is called before the real behavior methods
 * and is used to setup the context. However the context still holds some default values received from the
 * controller/ dispatcher.
 *
 * The values are the same in every function called in the behavior.
 *
 * The values are:
 * auth:    The authentication data (username/ password or an object).
 * caller:  The object calling the behavior.
 * data:    The data in the request (fields and files)
 * request: The data in the request (get variables)
 * result:  The resulting data from the behavior (only available in "onAfter" methods)
 */
Transactionable.prototype.initializeGet = function(context) {
    var self    = this;
    var objects = [];

    var object = ObjectManager.get('com://home/bank.model.account')
        .then(function(model) {
            return model.set('id', 1).getItem();
        })
        .then(function(source) {
            // Add the source role to the object.
            context.addRole('source', source);
        });
    objects.push(object);


    object = ObjectManager.get('com://home/bank.model.account')
        .then(function(model) {
            return model.set('id', 2).getItem();
        })
        .then(function(destination) {
            context.addRole('destination', destination, function() {
                this.transfer = function(amount) {
                    var self = this;
                    var source = context.getRole('source');
                    source.setData({
                        amount: source.data.amount -= amount
                    });
                    return source.save()
                        .then(function() {
                            return self.setData({
                                amount: self.data.amount += amount
                            })
                            .save();
                        });
                }
            });
        });
    objects.push(object);

    return Promise.all(objects)
        .then(function() {
            return context;
        });
};

Transactionable.prototype.onBeforeBrowse = function(context) {
    return Promise.resolve(context);
};

module.exports = Transactionable;