var AbstractController = require('./abstract'),
    util = require('util');

function DefaultController(config) {
    AbstractController.call(this, config);
}

util.inherits(DefaultController, AbstractController);

module.exports = DefaultController;