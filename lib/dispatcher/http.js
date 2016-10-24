var AbstractDispatcher = require('./abstract'),
    util = require('util');

function HttpDispatcher(config) {
    AbstractDispatcher.call(this, config);
}

util.inherits(HttpDispatcher, AbstractDispatcher);

module.exports = HttpDispatcher;