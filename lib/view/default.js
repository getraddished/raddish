var AbstractView = require('./abstract'),
    util = require('util');

function DefaultView(config) {
    AbstractView.call(this, config);
}

util.inherits(DefaultView, AbstractView);

module.exports = DefaultView;