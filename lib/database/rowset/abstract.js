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
     * @method getRow
     * @returns {AbstractRow|DefaultRow} The row object connected to this rowset.
     */
    getRow() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'row']);

        return this.getObject(identifier);
    }

    /**
     * This methods creates a new row object connected to this rowset.
     *
     * @method getRow
     * @returns {AbstractRow|DefaultRow} The row object connected to this rowset.
     */
    getTable() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'table']);

        return this.getObject(identifier);
    }

    /**
     * This method will set the isNew state on all containing Row objects.
     *
     * @method isNew
     * @param {Boolean} state The is new state to set.
     * @return {AbstractRowset} The current object for chaining.
     */
    isNew(state) {
        for(var row of this.rows) {
            row.isNew(state);
        }
        
        return this;
    }

    /**
     * This method will save all the contained row objects.
     *
     * @method save
     * @returns {Promise} A promise containing the current rowset object.
     */
    save() {
        var promises = [];

        for(var row of this.rows) {
            promises.push(row.save());
        }

        return Promise.all(promises);
    }

    /**
     * This method will delete all the contained row objects.
     *
     * @method delete
     * @return {Promise} A promise containing the current rowset object.
     */
    delete() {
        var promises = [];

        for(var row of this.rows) {
            promises.push(row.delete());
        }

        return Promise.all(promises);
    }

    /**
     * This method will set the received array on individual Row objects,
     * which are related to the current RowSet object.
     *
     * If the dataset parameter isn't an array, the current Rowset is return without any row objects.
     *
     * @method setData
     * @param {Array} dataset The data to set.
     * @return {Promise} A promise containing the current rowset object.
     */
    setData(dataset) {
        var self = this;

        if(!Array.isArray(dataset)) {
            return Promise.resolve(this);
        }

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

    /**
     * This mehtod returns an array with all the data of the contained Row objects.
     *
     * @method getData
     * @return {Array} The data in Array form.
     */
    getData() {
        var data = [];

        for(var row of this.rows) {
            data.push(row.getData());
        }

        return data;
    }
}

module.exports = AbstractRowset;