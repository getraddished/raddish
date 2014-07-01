function AbstractBuilder() {
    this.queryType = undefined;
};

AbstractBuilder.prototype.select = function() {
    var SelectQuery = require('./select');
    this.queryType = new SelectQuery();

    return this.queryType;
};

AbstractBuilder.prototype.insert = function() {
    var InsertQuery = require('./insert');
    this.queryType = new InsertQuery();

    return this.queryType;
};

AbstractBuilder.prototype.update = function() {
    var UpdateQuery = require('./update');
    this.queryType = new UpdateQuery();

    return this.queryType;
};

AbstractBuilder.prototype.delete = function() {
    var DeleteQuery = require('./delete');
    this.queryType = new DeleteQuery();

    return this.queryType;
};

module.exports = AbstractBuilder;