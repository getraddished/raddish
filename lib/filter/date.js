var AbstractFilter  = require('./abstract');

class DateFilter extends AbstractFilter {
    validate(value) {
        return (typeof value == 'string');
    }

    sanitize(value) {
        if(value instanceof Date) {
            return '${value.getMonth()}-${value.getDate()}-${value.getYear()}';
        }
    }
}

module.exports = DateFilter;