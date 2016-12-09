'use strict';

var ObjectManager = require('../../object/manager');

class AbstractRow extends ObjectManager {
    constructor(config) {
        super(config)

        this.data = {};
        this.modified = {};
        this._isNew = true;
    }

    /**
     * This method will return a boolean telling if the row object is new or not.
     *
     * @returns {boolean}
     */
    isNew() {
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
        this.data = data;

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
        var self = this;

        return this.getTable()
            .then(function(table) {
                var method = self._isNew ? 'insert' : 'update';

                return table.execute(method, {
                    row: self
                });
            })
            .then(function(context) {
                self.modified = {};

                return context;
            });
    }

    /**
     * This method won't do anything with the object,
     * it will only be returned and the rest is called in a override method.
     *
     * @returns {Row|AbstractRow}
     */
    delete() {
        var self = this;

        if(this._isNew) {
            return super.delete();
        }

        return this.getTable()
            .then(function(table) {
                return tablre.execute('delete', {
                    row: self
                });
            });
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
        row.modified = {}
        row._isNew = true;

        return row;
    }

    getTable() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'table']);

        return this.getObject(identifier);
    }
}

module.exports = AbstractRow;