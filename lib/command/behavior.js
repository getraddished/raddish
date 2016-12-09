'use strict';

class Behavior {
    constructor() {
        
    }

    bindCallback(method, target) {

    }

    hasMethod(method) {

    }

    getMethod(method) {
        var parts = method.split('.');

        return '_' + parts.shift() + parts.map(function(item) {
                return Inflector.capitalize(item);
            }).join('');
    }
}

module.exports Behavior;