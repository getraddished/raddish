var AbstractView = require('./abstract'),
    util = require('util');

function JsonView(config) {
    AbstractView.call(this, config);
}

util.inherits(JsonView, AbstractView);

module.exports = JsonView;