var AbstractTable = require('./abstract'),
    util = require('util'),
    RaddishDB = require('raddish-db'),
    Inflector = require('raddish-inflector');

function DefaultTable(config) {
    AbstractTable.call(this, config);

    this.table = '';
    this.db = 'default';
    this.adapter = null;
};

util.inherits(DefaultTable, AbstractTable);

DefaultTable.prototype._initialize = function(config) {
    this.identity_column = config.identity_column || null;
    this.table = config.db || Inflector.pluralize(this.getIdentifier().getName());
    this.db = config.db || this.db;
    this.adapter = RaddishDB.getInstance(this.db);

    return AbstractTable.prototype._initialize.call(this, config);
};

DefaultTable.prototype.getColumns = function() {
    return this.adapter.getColumns();
};

DefaultTable.prototype.getUniqueColumns = function() {
    return this.getColumns()
        .then(function(columns) {

        });
};

DefaultTable.prototype.getIdentityColumn = function() {
    if(this.identity_column !== null) {
        return this.identity_column;
    }

    return this.getUniqueColumns()
        .then(function(columns) {

        });
};

module.exports = DefaultTable;