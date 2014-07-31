"use strict";

/**
 * This function is the mixin object, this will help with mixing in the objects.
 * @constructor
 */
function Mixin() {

}

Mixin.prototype.mix = function(target, source) {
    if(source.length) {
        for(var index in source) {
            this.mix(target, source[index]);
        }
    } else if(typeof source.getMixableMethods == 'function') {
        target.hasMixins = true;

        var methods = source.getMixableMethods();
        for(var index in methods) {
            target[index] = methods[index];
        }
    }
};

Mixin.prototype.has = function(target) {
    if(target.hasMixins) {
        return true;
    } else {
        return false;
    }
};

module.exports = new Mixin();