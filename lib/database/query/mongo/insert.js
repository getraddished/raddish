var Abstract    = require('../abstract/query');
var util        = require('util');

function InsertQuery() {
    Abstract.call(this);

    this.method = 'insert';
    this.collection = '';
    this.query = {};
};

util.inherits(InsertQuery, Abstract);

InsertQuery.prototype.table = function(table) {
    this.collection = table;

    return this;
};

InsertQuery.prototype.set = function(column, value) {
    this.query[column] = value;

    return this;
};

InsertQuery.prototype.getTable = function() {
    return this.collection;
};

InsertQuery.prototype.getMethod = function() {
    return this.method;
};

InsertQuery.prototype.toQuery = function() {
    return this.query;
};

module.exports = InsertQuery;