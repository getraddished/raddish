'use strict';

var ObjectManager = require('../../object/manager');

class AbstractRow extends ObjectManager {
    constructor(config) {
        super(config);

        this.data = {};
        this.modified = [];
        this._isNew = true;
    }

    /**
     * This method will return a boolean telling if the row object is new or not.
     *
     * @returns {boolean}
     */
    isNew(state) {
        if(state !== undefined) {
            this._isNew = state;
        }

        return this._isNew;
    }

    /**
     * Set the data of the row object.
     * Within this method a check is done if a value is updated or not.
     *
     * @param {Object} data The new data of the row object.
     * @returns {AbstractRow}
     */
    setData(data) {
        for(var index in data) {
            if(data.hasOwnProperty(index)) {
                if(this.data[index] !== undefined) {
                    this.modified.push(index);
                }

                this.data[index] = data[index];
            }
        }

        return this;
    }

    /**
     * This method returns the data of the row object.
     *
     * @returns {Object} The data of the row object.
     */
    getData() {
        return this.data;
    }

    /**
     * This method saves the data.
     *
     * @returns {AbstractRow} The current row object.
     */
    save() {
        this._isNew = false;
        return this;
    }

    /**
     * This method won't do anything with the object,
     * it will only be returned and the rest is called in a override method.
     *
     * @returns {Row|AbstractRow}
     */
    delete() {
        return this;
    }

    /**
     * This is an extension on the global clone method.
     * It will return the data and modified data to an empty object.
     *
     * Also the isNew is reset to true.
     *
     * @returns {Row|AbstractRow} The cloned row object.
     */
    clone() {
        var row = super.clone();
        row.data = {};
        row.modified = {};
        row._isNew = true;

        return row;
    }

    /**
     * This returns the table object connected to this row object.
     *
     * @returns {AbstractTable|Table} The table object connected to this row object.
     */
    getTable() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'table']);

        return this.getObject(identifier);
    }
}

module.exports = AbstractRow;