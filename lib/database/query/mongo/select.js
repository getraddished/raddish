var Abstract    = require('../abstract/query');
var util        = require('util');

function SelectQuery() {
    Abstract.call(this);

    this.method = 'find';
    this.collection = '';
    this.query = {};
    this.collection = undefined;
    this.fields = [];
}

util.inherits(SelectQuery, Abstract);

SelectQuery.prototype.table = function(table) {
    if(!this.collection) {
        this.collection = table;
    }

    return this;
};

SelectQuery.prototype.where = function(column, constraint, value, condition) {
    var parts = [];
    var base = this.query;

    /**
     * Lets have a look. We need to have nested columns,
     * constraints need to be converted.
     * Values don't need to be converted.
     * Also the condition needs to be converted, if there is none selected it will default to and.
     */
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

    condition = condition ? condition.toLowerCase() : '';

    switch(condition) {
        case 'or':
            condition = '$or';
            break;
        default:
            condition = undefined;
            break;
    }

    // Now we will parse the columns also we will check if it is nested nor not.
    // Check if it is nested.
    if(column.indexOf('.') > -1) {
        // We have a nested column.
        parts = column.split('.');
    } else {
        parts.push(column);
    }

    if(condition) {
        if(!base[condition]) {
            base[condition] = [];
            base = base[condition];
        }
    }

    // So how do we format the columns?
    // Something is going wrong here.
    for(var index in parts) {
        if(!base[parts[index]]) {
            base[parts[index]] = {};
        }

        if(index == parts.length -1) {
            base[parts[index]] = value;
        } else {
            base = base[parts[index]];
        }
    }

    return this;
};

SelectQuery.prototype.columns = function(columns) {
    if(typeof columns.join == 'function') {
        for(var index in columns) {
            this.columns(columns[index]);
        }
    } else {
        this.fields.push(columns);
    }

    return this;
};

SelectQuery.prototype.getTable = function() {
    return this.collection;
};

SelectQuery.prototype.getColumns = function() {
    return this.fields;
};

SelectQuery.prototype.getMethod = function() {
    return this.method;
};

SelectQuery.prototype.toQuery = function() {
    return this.query;
};

module.exports = SelectQuery;