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
}

module.exports = AbstractTable;