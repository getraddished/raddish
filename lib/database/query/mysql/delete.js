var Abstract    = require('./abstract');
var util        = require('util');

function DeleteQuery() {
    Abstract.call(this);

    this.query = {};
    this.query.table = {};
    this.query.where = [];
};

util.inherits(DeleteQuery, Abstract);

DeleteQuery.prototype.table = function(table) {
    this.query.table = table;

    return this;
};

DeleteQuery.prototype.toQuery = function() {
    var table = this.query.table;
    var count = 0;
    var sql = 'DELETE FROM ' + this.quoteName(table);

    sql += this.getWhereStatement();

    return sql;
};

module.exports = DeleteQuery;