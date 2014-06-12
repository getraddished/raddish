var Abstract    = require('./abstract');
var util        = require('util');

function Modifiable() {
    Abstract.call(this);
};

util.inherits(Modifiable, Abstract);

Modifiable.prototype.onBeforeInsert = function(context) {
    if(context.data.data.hasOwnProperty('modified_on')) {
        var date = new Date();

        context.data.data.modified_on = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
    }

    return Promise.resolve(context);
};

module.exports = Modifiable;