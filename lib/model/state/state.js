'use strict';

var Filter = require('../../filter/filter');

/**
 * The state class will hold the state of the model.
 *
 * @class State
 */
class State {
    constructor() {
        this.states = {};
    }

    /**
     * The insert method will create a new state.
     *
     * @method insert
     * @param {String} key The name of the state.
     * @param {String} filter The filter to use for the state.
     * @param {Boolean} unique A boolean to set the state to true.
     * @param {*} value The default value of the state.
     * @return {State} The current State object for chaining.
     */
    insert(key, filter, unique, value) {
        this.states[key] = {
            filter: filter,
            unique: unique || false,
            value: value || null
        };

        return this;
    }

    /**
     * This method will set the value of the state.
     * Also a validate and sanitize will be done over the value.
     *
     * @method set
     * @param {String} key The name of the state to set.
     * @param {*} value The value to set to the state.
     * @return {State} The current State object for chaining.
     */
    set(key, value) {
        if(this.states[key]) {
            var state = this.states[key],
                filter = Filter.get(state.filter);

            if(!filter.validate(value)) {
                value = filter.sanitize(value);
            }

            state.value = value;
        }

        return this;
    }

    /**
     * The get method will return the value of the state.
     *
     * @method get
     * @param {String} key The name of the state.
     * @return {*} The value of the state.
     */
    get(key) {
        if(this.states[key]) {
            return this.states[key].value;
        }

        return false;
    }

    /**
     * The isUnique method will check if all the unique states have a value,
     * if not the current state is not unique and false will be returned.
     *
     * @method isUnique
     * @return {Boolean} True if all the unique states have a value, false otherwise.
     */
    isUnique() {
        var countUnique = 0,
            countWithValue = 0,
            state = null;

        for(var index in this.states) {
            if(this.states.hasOwnProperty(index)) {
                state = this.states[index];

                if (state.unique) {
                    countUnique++;

                    if (state.value) {
                        countWithValue++;
                    }
                }
            }
        }

        return (countUnique === countWithValue);
    }
}

module.exports = State;