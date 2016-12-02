var AbstractRow = require('./abstract'),
    util = require('util');

function DefaultRow(config) {
    AbstractRow.call(this, config);
}

util.inherits(DefaultRow, AbstractRow);

module.exports = DefaultRow;