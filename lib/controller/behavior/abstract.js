var ObjectManager   = require('../../object/manager');
var util            = require('util');

function AbstractControllerBehavior(config) {
    ObjectManager.call(this, config);
};

util.inherits(AbstractControllerBehavior, ObjectManager);

module.exports = AbstractControllerBehavior;