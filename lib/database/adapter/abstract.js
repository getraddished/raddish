var Service     = require('../../service/service');
var util        = require('util');
var instances   = {};

function AbstractAdapter() {
    this.queryBuilder = undefined;
};

util.inherits(AbstractAdapter, Service);

AbstractAdapter.prototype.getInstance = function(name, config) {

};

AbstractAdapter.prototype.getQuery = function() {
    return this.queryBuilder;
};

module.exports = AbstractAdapter;