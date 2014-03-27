var Base = require('../../base/base');
var util = require('util');

function Displayable() {

}

util.inherits(Displayable, Base);

Displayable.prototype.onBeforeGet = function (context) {
    return new Promise(function (resolve, reject) {
        context.test = 'Test';
        
        resolve(context);
    });
};

module.exports = Displayable;