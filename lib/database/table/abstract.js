'use strict';

var ObjectManager = require('../../object/manager');

class AbstractTable extends ObjectManager {
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

    getUniqueColumns() {
        return this.getColumns()
            .then(function(columns) {
                var fields = [];

                for(var index of columns) {
                    if(columns[index].unique) {
                        fields.push(columns[index]);
                    }
                }

                return fields;
            });
    }

    _actionInsert(context) {

    }

    _actionUpdate(context) {

    }

    _actionDelete(context) {

    }
}

module.exports = AbstractTable;