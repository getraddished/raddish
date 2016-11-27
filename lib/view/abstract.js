var ObjectManager = require('../object/manager'),
    util = require('util');

function AbstractView(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractView, ObjectManager);

module.exports = AbstractView;