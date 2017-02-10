'use strict';

var ObjectManager = require('../../object/manager'),
    RaddishDB = require('raddish-db');

class AbstractTable extends ObjectManager {
    constructor(config) {
        super(config);

        this.name = '';
    }

    getQueryBuilder() {
        return RaddishDB.getQueryBuilder();
    }

    getRow() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'row']);

        return this.getObject(identifier);
    }

    getRowset() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'rowset']);

        return this.getObject(identifier);
    }

    getColumns() {
        return [];
    }

    getName() {
        return this.name;
    }

    getUniqueColumns() {
        return this.getColumns()
            .then(function(columns) {
                var fields = [];

                for(var column of columns) {
                    if(column.unique) {
                        fields.push(column);
                    }
                }

                return fields;
            });
    }

    _actionSelect() {
        throw new Error('AbstractTable cannot select objects, please implement this method.');
    }

    _actionInsert() {
        throw new Error('AbstractTable cannot insert objects, please implement this method.');
    }

    _actionUpdate() {
        throw new Error('AbstractTable cannot update objects, please implement this method.');
    }

    _actionDelete() {
        throw new Error('AbstractTable cannot delete objects, please implement this method.');
    }
}

module.exports = AbstractTable;