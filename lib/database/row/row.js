var Base  = require('../../base/base');
var util    = require('util');

function Row() {
    Base.apply(this, arguments);
    
    this.data = {};
}

util.inherits(Row, Base);

Row.prototype.setData = function (data, callback) {
    this.data = data;

    callback(this);
};

Row.prototype.getData = function (callback) {
    callback(this.data);
};

module.exports = Row;