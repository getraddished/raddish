var Abstract    = require('../abstract/builder');
var util        = require('util');

function MysqlQueryBuilder() {
    Abstract.call(this);

    this.tables = {};
};

util.inherits(MysqlQueryBuilder, Abstract);

MysqlQueryBuilder.prototype.table = function(table, alias) {
    // Prevent double setting of tables.
    if(!this.tables[table]) {
        this.tables[table] = {
            table: table,
            alias: alias
        };
    }

    return this;
};

MysqlQueryBuilder.prototype.select = function() {
    var SelectQuery = require('./select');
    this.queryType = new SelectQuery();

    return this.queryType;
};

MysqlQueryBuilder.prototype.insert = function() {
    var InsertQuery = require('./insert');
    this.queryType = new InsertQuery();

    return this.queryType;
};

MysqlQueryBuilder.prototype.update = function() {
    var UpdateQuery = require('./update');
    this.queryType = new UpdateQuery();

    return this.queryType;
};

MysqlQueryBuilder.prototype.delete = function() {
    var DeleteQuery = require('./delete');
    this.queryType = new DeleteQuery();

    return this.queryType;
};

module.exports = MysqlQueryBuilder;