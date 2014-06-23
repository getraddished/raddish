var Abstract    = require('./abstract');
var util        = require('util');

function InsertQuery() {
    Abstract.call(this);

    this.query = {};
    this.query.tables = [];
    this.query.set = [];
}

util.inherits(InsertQuery, Abstract);

InsertQuery.prototype.table = function(table) {
    this.query.table = table;

    return this;
};

InsertQuery.prototype.set = function(column, value) {
    this.query.set.push({
        column: column,
        value: value
    });

    return this;
};

InsertQuery.prototype.toQuery = function() {
    var columns = [];
    var values = [];
    var table = this.query.table;

    var sql = 'INSERT INTO ' + this.quoteName(table);

    if(this.query.set.length > 0) {
        for(var index in this.query.set) {
            var insert = this.query.set[index];

            columns.push(this.quoteName(insert.column));
            values.push(this.escape(insert.value));
        }

        sql += ' (' + columns.join(', ') + ') VALUES (' + values.join(', ') + ')';
    }

    return sql;
};

module.exports = InsertQuery;