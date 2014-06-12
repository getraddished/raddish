var Abstract    = require('./abstract');
var util        = require('util');

function Creatable() {
    Abstract.call(this);
};

util.inherits(Creatable, Abstract);

Creatable.prototype.onBeforeInsert = function(context) {
    if(context.data.data.hasOwnProperty('created_on')) {
        var date = new Date();

        context.data.data.created_on = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
    }

    return Promise.resolve(context);
};

module.exports = Creatable;