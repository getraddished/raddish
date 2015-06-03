var AbstractFilter = require('./abstract'),
    util = require('util');

function JsonFilter(config) {
    AbstractFilter.call(this, config);
};

util.inherits(JsonFilter, AbstractFilter);

JsonFilter.prototype._validate = function(value) {
    try {
        if(typeof value === 'string') {
            JSON.parse(value)
            return true;
        } else if (typeof value === 'object' && value !== null) {
            return true;
        }
    } catch(error) {
        return false;
    }
};

JsonFilter.prototype._sanitize = function(value) {
    if(value instanceof Object) {
        return JSON.stringify(value);
    } else if (value instanceof String) {
        return JSON.parse(value);
    }
}

module.exports = JsonFilter;