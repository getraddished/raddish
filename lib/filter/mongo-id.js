var Abstract    = require('./abstract'),
    ObjectID    = require('mongodb').ObjectID,
    util        = require('util');

function MongoIDFilter() {
    Abstract.call(this);
};

util.inherits(MongoIDFilter, Abstract);

MongoIDFilter.prototype._validate = function(value) {
    return (value instanceof ObjectID) ? true : false;
};

MongoIDFilter.prototype._sanitize = function(value) {
    return new ObjectID(value);
};

module.exports = MongoIDFilter;