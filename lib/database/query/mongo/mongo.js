var Abstract    = require('../abstract/builder');
var util        = require('util');

function MongoQueryBuilder() {
    Abstract.call(this);

    this.type = 'mongo';
}

util.inherits(MongoQueryBuilder, Abstract);

module.exports = MongoQueryBuilder;