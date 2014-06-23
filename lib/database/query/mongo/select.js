var Abstract    = require('../abstract/query');
var util        = require('util');

function SelectQuery() {
    Abstract.call(this);

    this.query = {};
    this.table = undefined;
}

util.inherits(SelectQuery, Abstract);

SelectQuery.prototype.table = function(table) {
    if(!this.table) {
        this.table = table;
    }

    return this;
};

SelectQuery.prototype.where = function(column, constraint, value, condition) {
    // We can add it directly to the query without any issues ;)
    switch(constraint) {
        case '>':
            constraint = '&gt';
            break;
        case '<':
            constraint = '&lt';
            break;
        case '=':
            constraint = undefined;
            break;
    }

    if(condition) {
        if(condition.toLowerCase() == 'or') {
            condition = '$or';
        }
    }
    if(condition) {
        if(!this.query[condition]) {
            this.query[condition] = [];
        }

        var query = {};
        if(constraint) {
            query[column] = {};
            query[column][constraint] = value;
        } else {
            query[column] = value;
        }

        this.query[condition].push(query);
    } else {
        if(constraint) {
            this.query[column] = {};
            this.query[column][constraint] = value;
        } else {
            this.query[column] = value;
        }
    }

    return this;
};

SelectQuery.prototype.toQuery = function() {
    return this.query;
};

module.exports = SelectQuery;