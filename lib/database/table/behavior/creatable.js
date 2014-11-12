var Abstract    = require('../../../command/behavior/behavior');
var util        = require('util');

function CreatableBehavior(config) {
    Abstract.call(this, config);
};

util.inherits(CreatableBehavior, Abstract);

CreatableBehavior.prototype.onBeforeInsert = function(context) {
    if(Object.keys(context.data.data).indexOf('created_on') > -1) {
        context.data.data.created_on = new Date().toISOString();
    }

    return Promise.resolve(context);
};

module.exports = CreatableBehavior;