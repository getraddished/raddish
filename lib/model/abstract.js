'use strict';

var ObjectManager = require('../object/manager'),
    State = require('./state/state');

class AbstractModel extends ObjectManager {
    constructor(config) {
        super(config)

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
                for(var index in columns) {
                    if(columns.hasOwnProperty(index)) {
                        var column = columns[index];

                        self.setState(column.name, column.filter);
                    }
                }

                return self;
            });
    }

    setState(key, value) {
        if(typeof key === 'object') {
            for(var index in key) {
                if(key.hasOwnProperty(index)) {
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
        var table = yield this.getTable();
        return table.getRow();
    }

    getList() {
        var table = yield this.getTable();
        return table.getRowset();
    }
}

module.exports = AbstractModel;