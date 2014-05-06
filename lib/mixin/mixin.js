/**
 * This function is the mixin object, this will help with mixing in the objects.
 * @constructor
 */
function Mixin() {

}

Mixin.prototype.mix = function(target, source) {
    if(typeof source.getMixableMethods == 'function') {
        target.hasMixins = true;

        var methods = source.getMixableMethods();

        for(var index in methods) {
            target[index] = methods[index];
        }
    }
};

Mixin.prototype.mixProxy = function(target, name, source) {
    // Check if the name isn't set, if it is return an error.
    if(!target[name]) {

    } else {
        throw new RaddishError(500, 'Can\'t mix to a set index.');
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