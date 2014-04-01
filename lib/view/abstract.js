var Base = require('../base/base');
var util = require('util');

function ViewAbstract() {

}

util.inherits(ViewAbstract, Base);

ViewAbstract.prototype.setData = function(data) {
    this.data = data;
};

module.exports = ViewAbstract;