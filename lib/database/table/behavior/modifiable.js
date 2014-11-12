var Abstract    = require('../../../command/behavior/behavior');
var util        = require('util');

function CreatableBehavior(config) {
    Abstract.call(this, config);
};

util.inherits(CreatableBehavior, Abstract);

CreatableBehavior.prototype.onBeforeUpdate = function(context) {
    console.log('Called');

    if(Object.keys(context.data.data).indexOf('modified_on') > -1) {
        context.data.modified.modified_on = new Date().toISOString();
    }

    return Promise.resolve(context);
};

module.exports = CreatableBehavior;