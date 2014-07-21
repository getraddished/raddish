var Abstract    = require('../abstract/query');
var util        = require('util');

function AbstractMysqlQuery() {
    Abstract.call(this);
};

util.inherits(AbstractMysqlQuery, Abstract);

AbstractMysqlQuery.prototype.quoteName = function(name) {
    var regex   = new RegExp(/(?:\b|\\#)+([a-z0-9.#-_]+)(?!`)\b/g);
    var self    = this;
    
    return name.replace(regex, function(match) {
        // We also have to check for dots.
        if(match.indexOf('.') > -1) {
            var parts = match.split('.');

            for(var index in parts) {
                parts[index] = self.quoteName(parts[index]);
            }

            return parts.join('.');
        } else if (match == '*') {
            return match;
        } else {
            return '`' + match + '`';
        }
    });
};

AbstractMysqlQuery.prototype.where = function(column, constraint, value, condition) {
    condition = condition ? condition : 'AND';

    this.query.where.push({
        column: column,
        constraint: constraint,
        value: value,
        condition: condition
    });

    return this;
};

AbstractMysqlQuery.prototype.getWhereStatement = function() {
    var sql = '';

    var count = 0;
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

AbstractMysqlQuery.prototype.escape = function(value) {
    // We will escape a value over here.
    // If the value isn't a string, cast it;
    if(typeof value != 'string' && value != null) {
        value = value.toString();
    } else if(value == null) {
        value = 'null';
    }

    return '\'' + value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\'';
};

module.exports = AbstractMysqlQuery;