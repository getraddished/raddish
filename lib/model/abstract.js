var ObjectManager = require('../object/manager'),
    util = require('util');

function AbstractModel(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractModel, ObjectManager);

module.exports = AbstractModel;