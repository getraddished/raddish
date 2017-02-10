'use strict';

var Filter = require('../../filter/filter');

class State {
    constructor() {
        this.states = {};
    }

    insert(key, filter, unique, value) {
        this.states[key] = {
            filter: filter,
            unique: unique,
            value: value
        };

        return this;
    }

    set(key, value) {
        if(this.states[key]) {
            var state = this.states[key],
                filter = Filter.getFilter(state.filter);

            if(!filter.validate(value)) {
                value = filter.sanitize(value);
            }

            state.value = value;
        }

        return this;
    }

    get(key) {
        if(this.states[key]) {
            return this.states[key].value || this.states[key].default;
        }

        return false;
    }

    isUnique() {
        var countUnique = 0,
            countWithValue = 0,
            state = null;

        for(var index in this.states) {
            if(this.states.hasOwnProperty(index)) {
                state = this.states[index];

                if (state.unique) {
                    countUnique++;
                }

                if (state.value) {
                    countWithValue++;
                }
            }
        }

        return (countUnique === countWithValue);
    }
}

module.exports = State;