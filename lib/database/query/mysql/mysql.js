var Abstract    = require('../abstract/builder');
var util        = require('util');

function MysqlQueryBuilder() {
    Abstract.call(this);

    this.tables = {};
    this.type = 'mysql';
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

module.exports = MysqlQueryBuilder;