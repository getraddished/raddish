'use strict';

var AbstractFilter  = require('./abstract'),
    Filter          = require('./filter');

class SlugFilter extends AbstractFilter {
    constructor() {
        super();

        this.separator = '-';
    }

    validate(value) {
        var filter = Filter.getFilter('cmd');

        return filter.validate(value);
    }

    sanitize(value) {
        value = value.toString();

        value.replace(' ', this.separator);
        value = value.toLowerCase();
        value = value.trim();

        value = value.replace(/\s+/g, this.separator);
        value = value.replace(/[^A-Za-z0-9\-]/g, '');

        return value.replace(/[-]+/g, this.separator);
    }
}

module.exports = SlugFilter;