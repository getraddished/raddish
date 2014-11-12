var Abstract    = require('../../../command/behavior/behavior');
var util        = require('util');

function CreatableBehavior(config) {
    Abstract.call(this, config);
};

util.inherits(CreatableBehavior, Abstract);

CreatableBehavior.prototype.onBeforeInsert = function(context) {
    if(context.data.data['created_on'] === null) {
        context.data.data.created_on = new Date();
    }

    return Promise.resolve(context);
};

module.exports = CreatableBehavior;