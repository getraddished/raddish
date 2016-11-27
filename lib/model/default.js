var AbstractModel = require('./abstract'),
    util = require('util');

function DefaultModel(config) {
    AbstractModel.call(this, config);
}

util.inherits(DefaultModel, AbstractModel);

module.exports = DefaultModel;