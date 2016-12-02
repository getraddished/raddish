'use strict';

class CommandRole {
    getMixableMethods() {
        var methods = [];

        for(var index in this) {
            if(typeof this[index] === 'function' && this.hasOwnProperty(index)) {
                methods[index] = this[index];
            }
        }

        return methods;
    }
}

module.exports = CommandRole;