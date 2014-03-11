var async   = require('async');
var base    = require('../base');

function CommandChain(parent, callback) {
    this.behaviors = undefined;

    if(parent.behaviors) {
        console.log('Parent has behaviors');
    }
}

CommandChain.prototype.run = function(behavior, context, callback) {

};

module.exports = CommandChain;