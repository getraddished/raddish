function AbstractFilter() {

};

AbstractFilter.prototype.validate = function(value) {
    return this._validate(value);
};

AbstractFilter.prototype.sanitize = function(value) {
    return this._sanitize(value);
};

module.exports = AbstractFilter;