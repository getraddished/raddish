var Service = require('../../service/service');
var util    = require('util');

function AbstractControllerBehavior() {
    Service.call(this);
};

util.inherits(AbstractControllerBehavior, Service);

module.exports = AbstractControllerBehavior;