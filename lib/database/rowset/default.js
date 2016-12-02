var AbstractRowset = require('./abstract'),
    util = require('util');

function DefaultRowset(config) {
    AbstractRowset.call(this, config);

    this.rows = [];
}

util.inherits(DefaultRowset, AbstractRowset);

module.exports = DefaultRowset;