'use strict';

var AbstractTable = require('./abstract'),
    RaddishDB = require('raddish-db'),
    Inflector = require('raddish-inflector');

class DefaultTable extends AbstractTable {
    constructor(config) {
        super(config);

        this.table = '';
        this.db = 'default';
        this.adapter = null;
    }

    _initialize(config) {
        this.identity_column = config.identity_column || null;
        this.table = config.table || Inflector.pluralize(this.getIdentifier().getName());
        this.db = config.db || this.db;
        this.adapter = Raddish.getInstance(this.db);

        return super._initialize(config);
    }

    getColumns() {
        return this.adapter.getColumns();
    }

    getUniqueColumns() {
        var columns = yield this.getColumns();

    }

    getIdentityColumn() {
        if(this.identity_column) {
            return this.identity_column;
        }

        var columns = yield this.getUniqueColumns();
    }
}

module.exports = DefaultTable;