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

    sql += this.getWhereStatement();

    return sql;
};

module.exports = UpdateQuery;