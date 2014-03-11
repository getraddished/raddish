function States() {
    this.states = {};
}

States.prototype.insert = function (name, defaultValue, unique) {
    this.states[name] = {
        defaultValue: defaultValue,
        unique: unique,
        value: undefined
    };
    
    return this;
};

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

States.prototype.set = function (name, value) {
    if (this.states[name]) {
        this.states[name].value = value;
    }
    
    return this;
};

module.exports = States;