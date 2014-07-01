var Abstract    = require('./abstract');
var util        = require('util');

function UpdateQuery() {
    Abstract.call(this);

    this.query = {};
    this.query.table = {};
    this.query.set = [];
    this.query.where = [];
};

util.inherits(UpdateQuery, Abstract);

UpdateQuery.prototype.table = function(table) {
    this.query.table = table;
};

UpdateQuery.prototype.set = function(column, value) {
    this.query.set.push({
        column: column,
        value: value
    });

    return this;
};

UpdateQuery.prototype.where = function(column, constraint, value, condition) {
    condition = condition ? condition : 'AND';

    this.query.where.push({
        column: column,
        constraint: constraint,
        value: value,
        condition: condition
    });

    return this;
};

UpdateQuery.prototype.toQuery = function() {
    var table = this.query.table;
    var count = 0;
    var sql = 'UPDATE ' + this.quoteName(table) + ' SET';

    if(this.query.set.length > 0) {
        for(var index in this.query.set) {
            var update = this.query.set[index];

            sql += ' ' + this.quoteName(update.column) + ' = ' + this.escape(update.value);

            if(this.query.set.length - 1 > count) {
                sql += ',';
            }

            count++;
        }
    }

    count = 0;
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

module.exports = UpdateQuery;