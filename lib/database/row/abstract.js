'use strict';

var ObjectManager = require('../../object/manager');

/**
 * The abstract row holds all the abstract method for the Row object.
 * All basic methods can be found here.
 *
 * @class AbstractRow
 */
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
     * @method isNew
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
     * @method setData
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
     * @method getData
     * @returns {Object} The data of the row object.
     */
    getData() {
        return this.data;
    }

    /**
     * This method saves the data.
     *
     * @method save
     * @returns {AbstractRow} The current row object.
     */
    save() {
        this._isNew = false;
        return Promise.resolve(this);
    }

    /**
     * This method won't do anything with the object,
     * it will only be returned and the rest is called in a override method.
     *
     * @method delete
     * @returns {Row|AbstractRow}
     */
    delete() {
        return Promise.resolve(this);
    }

    /**
     * This is an extension on the global clone method.
     * It will return the data and modified data to an empty object.
     *
     * Also the isNew is reset to true.
     *
     * @method clone
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
     * @method getTable
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