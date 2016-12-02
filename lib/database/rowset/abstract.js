'use strict';

var ObjectManager = require('../../object/manager');

class AbstractRowset extends ObjectManager {
    constructor(config) {
        super(config);

        this.rows = [];
    }

    getRow() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'row']);

        return this.getObject(identifier);
    }

    save() {
        var promises = [];

        for(var index in this.rows) {
            if(this.rows.hasOwnProperty(index)) {
                promises.push(this.rows[index].save());
            }
        }

        return Promise.all(promises);
    }

    delete() {
        var promises = [];

        for(var index in this.rows) {
            if(this.rows.hasOwnProperty(index)) {
                promises.push(this.rows[index].delete());
            }
        }

        return Promise.all(promises);
    }

    createRow() {
        var row = yield this.getRow();

        this.rows.push(row);

        return row;
    }
}

module.exports = AbstractRowset;