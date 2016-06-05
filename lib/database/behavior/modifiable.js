"use strict";

var Abstract    = require('../../../command/behavior/behavior'),
    util        = require('util');

/**
 * The modifiable behavior will automatically populate and update the modified_on column.
 * When modified isn't in the submitted data, it will be added
 *
 * @param {Object} config The config object
 * @constructor
 */
function CreatableBehavior(config) {
    Abstract.call(this, config);
}

util.inherits(CreatableBehavior, Abstract);

CreatableBehavior.prototype.onBeforeUpdate = function(context) {
    if(Object.keys(context.getProperty('row').data).indexOf('modified_on') > -1) {
        context.getProperty('row').modified.modified_on = new Date().toISOString();
    }

    return Promise.resolve(context);
};

module.exports = CreatableBehavior;
