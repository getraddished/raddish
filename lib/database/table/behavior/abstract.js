var Service = require('../../../service/service');
var util    = require('util');

function AbstractTableBehavior(config) {
    Service.call(this, config);
};

util.inherits(AbstractTableBehavior, Service);

module.exports = AbstractTableBehavior;