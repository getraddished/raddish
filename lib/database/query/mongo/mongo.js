var Abstract    = require('../abstract/builder');
var util        = require('util');

function MongoQueryBuilder() {
    Abstract.call(this);
}

util.inherits(MongoQueryBuilder, Abstract);

MongoQueryBuilder.prototype.select = function() {
    var SelectQuery = require('./select');
    this.queryType = new SelectQuery();

    return this.queryType;
};

MongoQueryBuilder.prototype.insert = function() {
    var InsertQuery = require('./insert');
    this.queryType = new InsertQuery();

    return this.queryType;
};

MongoQueryBuilder.prototype.update = function() {
    var UpdateQuery = require('./update');
    this.queryType = new UpdateQuery();

    return this.queryType;
};

MongoQueryBuilder.prototype.delete = function() {
    var DeleteQuery = require('./delete');
    this.queryType = new DeleteQuery();

    return this.queryType;
};

module.exports = MongoQueryBuilder;