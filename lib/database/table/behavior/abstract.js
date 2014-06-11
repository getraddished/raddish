var Service = require('../../../service/service');
var util    = require('util');

function AbstractTableBehavior() {
    Service.call(this);
};

util.inherits(AbstractTableBehavior, Service);

module.exports = AbstractTableBehavior;