var ObjectManager = require('../../object/manager'),
    util = require('util');

function AbstractRow(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractRow, ObjectManager);

module.exports = AbstractRow;