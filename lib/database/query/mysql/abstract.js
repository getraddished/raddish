var Abstract    = require('../abstract/query');
var util        = require('util');

function AbstractMysqlQuery() {
    Abstract.call(this);
};

util.inherits(AbstractMysqlQuery, Abstract);

AbstractMysqlQuery.prototype.quoteName = function(name) {
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

AbstractMysqlQuery.prototype.escape = function(value) {
    // We will escape a value over here.
    // If the value isn't a string, cast it;
    if(typeof value != 'string') {
        value = value.toString();
    }

    return '\'' + value.replace(/[-'\/\\^$*+?()|[\]{}]/g, '\\$&') + '\'';
};

module.exports = AbstractMysqlQuery;