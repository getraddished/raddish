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

        for(var row of this.rows) {
            promises.push(row.save());
        }

        return Promise.all(promises);
    }

    delete() {
        var promises = [];

        for(var row of this.rows) {
            promises.push(row.delete());
        }

        return Promise.all(promises);
    }

    setData(dataset) {
        var self = this;

        return this.getRow()
            .then(function(row_object) {
                for(var data of dataset) {
                    var row = row_object.clone();

                    row.setData(data);
                    self.rows.push(row);
                }

                return self;
            });
    }

    getData() {
        var data = [];

        for(var row of this.rows) {
            data.push(row.getData());
        }

        return data;
    }

    createRow() {
        return this.getRow()
            .then(function(row) {
                this.rows.push(row);

                return row;
            }.bind(this));
    }
}

module.exports = AbstractRowset;