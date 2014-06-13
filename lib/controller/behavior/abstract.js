var Service = require('../../service/service');
var util    = require('util');

function AbstractControllerBehavior(config) {
    Service.call(this, config);
};

util.inherits(AbstractControllerBehavior, Service);

module.exports = AbstractControllerBehavior;