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

DeleteQuery.prototype.where = function(column, constraint, value, condition) {
    condition = condition ? condition : 'AND';

    this.query.where.push({
        column: column,
        constraint: constraint,
        value: value,
        condition: condition
    });

    return this;
};

DeleteQuery.prototype.toQuery = function() {
    var table = this.query.table;
    var count = 0;
    var sql = 'DELETE FROM ' + table;

    if(this.query.where.length > 0) {
        sql += ' WHERE';

        for(var index in this.query.where) {
            var where = this.query.where[index];

            sql += ' ' + this.quoteName(where.column) + ' ' + where.constraint + ' ' + this.escape(where.value);

            if(this.query.where.length - 1 > count) {
                sql += ' ' + where.condition;
            }
            count++;
        }
    }

    return sql;
};

module.exports = DeleteQuery;