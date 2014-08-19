function AbstractBuilder() {
    this.queryType = undefined;
    this.type = undefined;
};

AbstractBuilder.prototype.select = function() {
    var SelectQuery = require(__dirname + '/../' + this.type + '/select');
    this.queryType = new SelectQuery();

    return this.queryType;
};

AbstractBuilder.prototype.insert = function() {
    var InsertQuery = require(__dirname + '/../' + this.type + '/insert');
    this.queryType = new InsertQuery();

    return this.queryType;
};

AbstractBuilder.prototype.update = function() {
    var UpdateQuery = require(__dirname + '/../' + this.type + '/update');
    this.queryType = new UpdateQuery();

    return this.queryType;
};

AbstractBuilder.prototype.delete = function() {
    var DeleteQuery = require(__dirname + '/../' + this.type + '/delete');
    this.queryType = new DeleteQuery();

    return this.queryType;
};

module.exports = AbstractBuilder;