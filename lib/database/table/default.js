"use strict";

var Abstract        = require('./abstract'),
    Inflector       = require('../../inflector/inflector'),
    util            = require('util');

function Table(config) {
    Abstract.call(this, config);
}

util.inherits(Table, Abstract);

Table.prototype._actionSelect = function(context) {
    return this.getAdaper()
        .then(function(adapter) {
            return adapter.execute(context.query);
        })
        .then(function(result) {
            // Get the correct object.
            var object = null,
                data = null;

            if(context.mode === 2) {
                object = this.getRowset();
                data = result.rows;
            } else if(context.mode === 1) {
                object = this.getRow();
                data = result.rows[0];
            }

            return object
                .then(function(obj) {
                    return obj.setData(data);
                });
        });
};

/**
 * So what needs to happen?
 * First I have to make a better system for all the default things.
 * This also means that I have to change the Model layer a little bit.
 */

module.exports = Table;