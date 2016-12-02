'use strict';

/**
 * This is the mixin object, this will help with mixing in the objects.
 *
 * @class Mixin
 * @constructor
 */
class Mixin {
    /**
     * Mix the mixableMethods of the source into the target.
     * This will also set the hasMixins property on the target.
     *
     * @method mix
     * @param {Object} target The object receiving the methods
     * @param {Object} source The object giving the methods
     */
    mix(target, source) {
        var methods;

        if(source.length) {
            for(var index in source) {
                this.mix(target, source[index]);
            }
        } else if(typeof source.getMixableMethods == 'function') {
            target.hasMixins = true;

            methods = source.getMixableMethods();
            for(var index in methods) {
                if(!target[index]) {
                    target[index] = methods[index];
                }
            }
        }
    }

    /**
     * This method checks if the target has mixins defined or not.
     *
     * @method has
     * @param {Object} target The object to be checked.
     * @returns {boolean} The value of the hasMixin property.
     */
    has(target) {
        if(target.hasMixins) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = new Mixin();