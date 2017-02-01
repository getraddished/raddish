'use strict';

var ObjectManager = require('../object/manager'),
    Inflector = require('raddish-inflector');

class Behavior extends ObjectManager {
    constructor(config) {
        super(config);

        this.methods = {};
    }

    registerMethod(method, target) {
        if(!this.methods[method]) {
            this.methods[method] = target;
        }
    }

    execute(method, context) {
        if(this.methods[method]) {
            method = this.methods[method];
        } else {
            method = this.getMethod(method);
        }

        if(typeof method === 'string') {
            return this[method](context);
        } else if(typeof method === 'function') {
            return method.call(this, context);
        }
    }

    hasMethod(method) {
        if(this.methods[method]) {
            return true;
        }

        method = this.getMethod(method);
        return (typeof this[method] === 'function');
    }

    getMethod(method) {
        var parts = method.split('.');

        return '_' + parts.shift() + parts.map(function(item) {
                return Inflector.capitalize(item.toLowerCase());
            }).join('');
    }
}

module.exports = Behavior;