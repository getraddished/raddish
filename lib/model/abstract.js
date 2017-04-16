'use strict';

var ObjectManager = require('../object/manager'),
    State = require('./state/state');

/**
 * The AbstractModel class holds all the method for the basic model.
 * By default no states are set.
 *
 * @class AbstractModel
 * @extends ObjectManager
 */
class AbstractModel extends ObjectManager {
    constructor(config) {
        super(config);

        this.state = new State();
    }

    _initialize(config) {
        var self = this;

        return super._initialize(config)
            .then(function() {
                return self.getTable();
            })
            .then(function(table) {
                return table.getUniqueColumns();
            })
            .then(function(columns) {
                for(var column of columns) {
                    self.state.insert(column.name, column.filter || 'raw', true);
                }

                return self;
            });
    }

    /**
     * This method will set the states of the model.
     *
     * @method setState
     * @param {String| Object} key The state name/ object of states to set.
     * @param {*} value The value for the state.
     * @return {AbstractModel} The current model object for chaining.
     */
    setState(key, value) {
        if(typeof key === 'object') {
            for(var index in key) {
                if(Object.prototype.hasOwnProperty.call(key, index)) {
                    this.state.set(index, key[index]);
                }
            }
        } else {
            this.state.set(key, value);
        }

        return this;
    }

    /**
     * This method will return the table related to the model.
     *
     * @method getTable
     * @return {Promise} A promise containing the table object.
     */
    getTable() {
        var self = this,
            identifier = this.getIdentifier()
                .clone()
                .setPath(['database', 'table']);

        if(this.related['table']) {
            return Promise.resolve(this.related.table);
        }

        return this.getObject(identifier)
            .then(function(table) {
                self.related.table = table;

                return table;
            });
    }

    /**
     * The getItem method will return a single item from the data layer.
     * By default an empty Row object is returned.
     *
     * @method getItem
     * @return {Promise} A promise contianing an empty Row object.
     */
    getItem() {
        return this.getTable()
            .then(function(table) {
                return table.getRow();
            });
    }

    /**
     * The getList method will return by default an empty Rowset object.
     *
     * @method getList
     * @return {Promise} A promise containing an empty Rowset object.
     */
    getList() {
        return this.getTable()
            .then(function(table) {
                return table.getRowset();
            });
    }
}

module.exports = AbstractModel;