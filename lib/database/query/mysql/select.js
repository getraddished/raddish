var Abstract    = require('./abstract');
var util        = require('util');

function SelectQuery() {
    Abstract.call(this);

    // Set everything into a single object.
    this.query = {};
    this.query.tables = [];
    this.query.columns = [];
    this.query.where = [];
    this.query.join = [];
    this.query.having = [];
    this.query.limit = 0;
    this.query.offset = 0;
    this.query.order = [];
};

util.inherits(SelectQuery, Abstract);

SelectQuery.prototype.table = function(table, alias) {
    this.query.tables.push({
        table: table,
        alias: alias
    });

    return this;
};

SelectQuery.prototype.columns = function(columns) {
    if(typeof columns.push == 'function') {
        for(var index in columns) {
            // Recurse throught the columns.
            this.columns(columns[index]);
        }
    } else {
        if(this.query.columns.indexOf(columns) == -1) {
            this.query.columns.push(columns);
        }
    }

    return this;
};

SelectQuery.prototype.join = function(type, table, condition) {
    this.query.join.push({
        type: type,
        table: table,
        condition: condition
    });

    return this;
};

SelectQuery.prototype.where = function(column, constraint, value, condition) {
    condition = condition ? condition : 'AND';

    this.query.where.push({
        column: column,
        constraint: constraint,
        value: value,
        condition: condition
    });

    return this;
};

SelectQuery.prototype.limit = function(limit) {
    this.query.limit = limit;

    return this;
};

SelectQuery.prototype.offset = function(offset) {
    this.query.offset = offset;

    return this;
};

SelectQuery.prototype.order = function(column, direction) {
    this.query.order.push({
        column: column,
        direction: direction
    });

    return this;
};

SelectQuery.prototype.toQuery = function() {
    var sql = 'SELECT';
    var count = 0;

    if(this.query.columns.length > 0) {
        for(var index in this.query.columns) {
            var column = this.query.columns[index];

            sql += ' ' + this.quoteName(column);
            if(this.query.columns.length - 1 > count) {
                sql += ',';
            }
            count++;
        }
    } else {
        sql += ' *';
    }

    if((length = Object.keys(this.query.tables).length) > 0) {
        sql += ' FROM';

        count = 0;
        for(var index in this.query.tables) {
            var table = this.query.tables[index];

            sql += ' ' + this.quoteName(table.table) + (table.alias ? ' AS ' + this.quoteName(table.alias) : '');
            if(length <= count) {
                sql += ',';
            }
            count++;
        }
    }

    // Join
    if(this.query.join.length > 0) {
        for(var index in this.query.join) {
            var join = this.query.join[index];

            sql += ' ' + join.type + ' JOIN ' + join.table + ' ON(' + join.condition + ')';
        }
    }

    // Where
    count = 0;
    if(this.query.where.length > 0) {
        sql += ' WHERE';

        for(var index in this.query.where) {
            var where = this.query.where[index];

            sql += ' ' + this.quoteName(where.column) + ' ' + where.constraint + ' ' + this.escape(where.value);

            if(this.query.where.length -1 > count) {
                sql += ' ' + where.condition;
            }
            count++;
        }
    }

    // Limit
    if(this.query.limit > 0) {
        sql += ' LIMIT ' + this.query.limit;

        if(this.query.offset > 0) {
            sql += ' OFFSET ' + this.query.offset;
        }
    }

    count = 0;
    if(this.query.order.length > 0) {
        sql += ' ORDER BY';

        for(var index in this.query.order) {
            var order = this.query.order[index];

            sql += ' ' + this.quoteName(order.column) + ' ' + order.direction.toUpperCase();

            if(this.query.order.length -1 > count) {
                sql += ',';
            }
            count++;
        }
    }

    return sql;
};

SelectQuery.prototype.quoteName = function(name) {
    // We also have to check for dots.
    if(name.indexOf('.') > -1) {
        var parts = name.split('.');

        for(var index in parts) {
            parts[index] = this.quoteName(parts[index]);
        }

        return parts.join('.');
    } else {
        return '`' + name + '`';
    }
};

SelectQuery.prototype.escape = function(value) {
    // We will escape a value over here.
    // If the value isn't a string, cast it;
    if(typeof value != 'string' && value != null) {
        value = value.toString();
    } else if(value == null) {
        value = 'null';
    }

    return '\'' + value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\'';
};

module.exports = SelectQuery;