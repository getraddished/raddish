'use strict';

var AbstractModel = require('../../../../../index').AbstractModel;

class DemoModel extends AbstractModel {
    constructor(config) {
        super(config);

        this.state.insert('test', 'int');
    }
}

module.exports = DemoModel;