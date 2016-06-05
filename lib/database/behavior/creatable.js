"use strict";

var Abstract    = require('../../../command/behavior/behavior'),
    util        = require('util');

/**
 * The creatable behavior will automatically populate the created_on column.
 * When created_on isn't in the submitted data, it will be added
 *
 * @param {Object} config The config object
 * @constructor
 */
function CreatableBehavior(config) {
    Abstract.call(this, config);
}

util.inherits(CreatableBehavior, Abstract);

CreatableBehavior.prototype.onBeforeInsert = function(context) {
    if(Object.keys(context.getProperty('row').data).indexOf('created_on') > -1) {
        context.getProperty('row').data.created_on = new Date().toISOString();
    }

    return Promise.resolve(context);
};

module.exports = CreatableBehavior;
