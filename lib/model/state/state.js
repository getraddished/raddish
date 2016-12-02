var Filter = require('../../filter/filter');

class State {
    cosntructor() {
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
        return this.states[key] || false;
    }

    isUnique() {
        // Get all the unique states.
        // Get all the unique states with a value

        // if the length is the same then it is ok.

        return false;
    }
}

module.exports = State;