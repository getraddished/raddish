"use strict";

/**
 * The states object is the handler for all the states.
 *
 * @class States
 * @constructor
 */
function States() {
    this.states = {};
}

/**
 * This function will insert a state in the object.
 * these will be used for filtering in the model.
 *
 * @method insert
 * @param {String} name The name of the state
 * @param {String} defaultValue The default value of the state
 * @param {Boolean} unique Determines if the state is unique or not
 * @returns {States} The states object used for chaining
 */
States.prototype.insert = function (name, filter, defaultValue, unique) {
    this.states[name] = {
        defaultValue: defaultValue,
        unique: unique,
        value: undefined,
        filter: filter
    };

    return this;
};

/**
 * This function will try to get a state from the object,
 * when the state isn't found it will return false.
 *
 * @method get
 * @param {String} name The name of the state to find
 * @returns {*} The return value of the state
 */
States.prototype.get = function (name) {
    if (name) {
        if(this.states[name]) {
            return this.states[name];
        } else {
            return false;
        }
    } else {
        return this.states;
    }
};

/**
 * This function will set the value of a single state.
 * This will only happen when the state is registred.
 *
 * @method set
 * @param {String} name Name of the state
 * @param {*} value The value the state should get
 * @returns {States}
 */
States.prototype.set = function (name, value) {
    if (this.states[name]) {
        var filter = this.states[name].filter;
        filter = this.getFilter(filter);

        if(!filter.validate(value)) {
            value = filter.sanitize(value);
        }

        if(filter.validate(value)) {
            this.states[name].value = value;
        }
    }

    return this;
};

/**
 * This function will check if the specified states are unique if it is it will return true,
 * else false.
 *
 * @method isUnique
 * @returns {boolean}
 */
States.prototype.isUnique = function () {
    for(var index in this.states) {
        if (this.states[index].unique && this.states[index].value) {
            return true;
        }
    }

    return false;
};

States.prototype.getFilter = function(filter) {
    try {
        var Filter = require('../../filter/' + filter);
        filter = new Filter();

        return filter;
    } catch(Error) {
        throw new RaddishError(500, 'Filter ' + filter + ' does not exist');
    }

};

module.exports = States;