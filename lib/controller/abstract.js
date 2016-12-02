'use strict';

var ObjectManger = require('../object/manager'),
    Inflector = require('raddish-inflector');

class AbstractController extends ObjectManger {
    constructor(config) {
        super(config);

        this.format = '';
        this.model = '';
    }

    _initialize(config) {
        this.format = config.format || Inflector.singularize(this.getIdentifier().getPackage());
        this.model = config.model || '';

        return super._initialize(config);
    }

    getModel() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['model']);

        return this.getObject(identifier);
    }

    getView() {
        var identifier = this.getIdentifier()
            .clone()
            .setPath(['view']);

        return this.getObject(identifier);
    }
}

module.exports = AbstractController;