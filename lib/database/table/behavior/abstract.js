var ObjectManager   = require('../../../object/manager');
var util            = require('util');

function AbstractTableBehavior(config) {
    ObjectManager.call(this, config);
};

util.inherits(AbstractTableBehavior, ObjectManager);

module.exports = AbstractTableBehavior;