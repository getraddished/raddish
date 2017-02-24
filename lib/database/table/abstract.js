'use strict';

var ObjectManager = require('../../object/manager'),
    RaddishDB = require('raddish-db');

/**
 * This is the abstract Table object.
 * This object contains all the shared methods for the table objects.
 *
 * Also this object can be used as a wrapper for custom Table methods.
 *
 * @class AbstractTable
 */
class AbstractTable extends ObjectManager {
    constructor(config) {
        super(config);

        this.column_map = {};
        this.name = '';
        this._columns = [];
    }

    /**
     * This method will return the query builder object.
     *
     * @return {QueryBuilder} A QueryBuilder instance of the RaddishDB query builder.
     */
    getQueryBuilder() {
        return RaddishDB.getQueryBuilder();
    }

    /**
     * This method will return the Row object related to the Table object.
     *
     * @return {Promise} A promise containing the related Row object.
     */
    getRow() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'row']);

        return this.getObject(identifier);
    }

    /**
     * This method will return the Rowset object related to the Table object.
     *
     * @return {Promise} A promise containing the related Rowset object.
     */
    getRowset() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'rowset']);

        return this.getObject(identifier);
    }

    /**
     * This method returns the columns set on the Table.
     * By default this is an empty array.
     *
     * @return {Promise} A promise containing the table columns.
     */
    getColumns() {
        return Promise.resolve(this._columns);
    }

    /**
     * This method returns the name of the table.
     *
     * @return {string} The name of the table object.
     */
    getName() {
        return this.name;
    }

    /**
     * This mehtod retuns an array of unique columns.
     *
     * @return {Promise} A promise containing the unique columns of the table.
     */
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

    /**
     * This method check for the column name of the given key, or reversed.
     *
     * @param {String} key The column name to return.
     * @param {Boolean} reverse Reverse the method. (default: false)
     * @return {String} The new name of the object key.
     */
    mapColumn(key, reverse) {
        var map = reverse ? {} : this.column_map,
            keys = Object.keys(this.column_map);

        if(reverse) {
            for(var index of keys) {
                map[this.column_map[index]] = index;
            }
        }

        return map[key] || key;
    }

    /**
     * This method will rename object keys to their new key when found.
     *
     * @param {Object} object The object to rename the keys of.
     * @param {Boolean} reverse A boolean to reverse the functionality.
     * @return {Object} The object with the renamed keys.
     */
    mapColumns(object, reverse) {
        var newKey = '';

        if(Array.isArray(object)) {
            for(var item of object) {
                this.mapColumns(item, reverse);
            }
        } else {
            for(var key in object) {
                if(object.hasOwnProperty(key)) {
                    newKey = this.mapColumn(key, reverse);

                    if (newKey && newKey !== key) {
                        object[newKey] = object[key];
                        delete object[key];
                    }
                }
            }
        }

        return object;
    }

    filterColumns(data) {
        var keys = Object.keys(data);

        return this.getColumns()
            .then(function(columns) {
                var result = {};

                for(var column of columns) {
                    if(keys.indexOf(column.name) > -1) {
                        result[column.name] = data[column.name];
                    }
                }

                return result
            });
    }

    /**
     * This method will return the unique column,
     * By default this is an empty string.
     *
     * @return {Promise} The unique column of the table.
     */
    getIdentityColumn() {
        return Promise.resolve('');
    }

    /**
     * This is the abstract select method.
     * When extending from the AbstractTable object this method needs to be overridden.
     *
     * @param {CommandContext} The context of the request.
     * @return {Promise} The promise containing the result.
     * @private
     */
    _actionSelect() {
        throw new Error('AbstractTable cannot select objects, please implement this method.');
    }

    /**
     * This is the abstract insert method.
     * When extending from the AbstractTable object this method needs to be overridden.
     *
     * @param {CommandContext} The context of the request.
     * @return {Promise} The promise containing the result.
     * @private
     */
    _actionInsert() {
        throw new Error('AbstractTable cannot insert objects, please implement this method.');
    }

    /**
     * This is the abstract update method.
     * When extending from the AbstractTable object this method needs to be overridden.
     *
     * @param {CommandContext} The context of the request.
     * @return {Promise} The promise containing the result.
     * @private
     */
    _actionUpdate() {
        throw new Error('AbstractTable cannot update objects, please implement this method.');
    }

    /**
     * This is the abstract delete method.
     * When extending from the AbstractTable object this method needs to be overridden.
     *
     * @param {CommandContext} The context of the request.
     * @return {Promise} The promise containing the result.
     * @private
     */
    _actionDelete() {
        throw new Error('AbstractTable cannot delete objects, please implement this method.');
    }
}

module.exports = AbstractTable;