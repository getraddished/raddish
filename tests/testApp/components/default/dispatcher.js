var Dispatcher  = require('raddish').Dispatcher;
var util        = require('util');

function AuraDefaultDispatcher() {
    AuraDefaultDispatcher.super_.apply(this, arguments);
}

util.inherits(AuraDefaultDispatcher, Dispatcher);

module.exports = AuraDefaultDispatcher;