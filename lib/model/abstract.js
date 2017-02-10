'use strict';

var ObjectManager = require('../object/manager'),
    State = require('./state/state');

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

    getTable() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['database', 'table']);

        return this.getObject(identifier);
    }

    getItem() {
        return this.getTable()
            .then(function(table) {
                return table.getRow();
            });
    }

    getList() {
        return this.getTable()
            .then(function(table) {
                return table.getRowset();
            });
    }
}

module.exports = AbstractModel;