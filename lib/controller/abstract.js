var ObjectManger = require('raddish').ObjectManager,
    util = require('util');

function AbstractController(config) {
    ObjectManger.call(this, config);
}

util.inherits(AbstractController, ObjectManger);

module.exports = AbstractController;