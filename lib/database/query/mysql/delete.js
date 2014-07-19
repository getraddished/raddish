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
};

DeleteQuery.prototype.toQuery = function() {
    var table = this.query.table;
    var count = 0;
    var sql = 'DELETE FROM ' + table;

    sql += this.getWhereStatement();

    return sql;
};

module.exports = DeleteQuery;