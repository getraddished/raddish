'use strict';

var ObjectManager = require('../../object/manager');

class AbstractRowset extends ObjectManager {
    constructor(config) {
        super(config);

        this.rows = [];
    }

    /**
     * This methods creates a new row object connected to this rowset.
     *
     * @returns {AbstractRow|DefaultRow} The row object connected to this rowset.
     */
    getRow() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'row']);

        return this.getObject(identifier);
    }

    isNew(state) {
        for(var row of this.rows) {
            row.isNew(state);
        }
        
        return this;
    }

    /**
     * This method will save all the connected row objects.
     *
     * @returns {Promise.<*>}
     */
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
            .then(function(rowObject) {
                for(var data of dataset) {
                    var row = rowObject.clone();

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
}

module.exports = AbstractRowset;