"use strict";

/**
 * For the refactor first I need to check which methods need to be there.
 * These will be:
 *
 * - Initialize
 * - getRow
 * - getRowset
 * - execute
 * - getName
 * - getAdapter
 * - getColumns
 * - getUniqueColumns
 * - getIdentityColumn
 */

var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    Inflector       = require('../../inflector/inflector'),
    Filter          = require('../../filter/filter'),
    CommandContext  = require('../../command/context/context');

/**
 * This class holds the basic methods of the table object.
 *
 * @class AbstractTable
 * @extends ObjectManager
 * @param config
 * @constructor
 */
function AbstractTable(config) {
    ObjectManager.call(this, config);

    this.context = new CommandContext();
    this.adapter = null;
}

util.inherits(AbstractTable, ObjectManager);

AbstractTable.prototype.getContext = function() {
    // The context is a reference, which is exactly what we want.
    return this.context;
};

AbstractTable.prototype.execute = function(method, context) {
    var self = this,
        chain = this.getCommandChain();

    method = method.toLowerCase();

    return chain.run('before.' + method, context)
        .then(function(context) {
            return self['_action' + Inflector.capitalize(method)](context);
        })
        .then(function(data) {
            context.result = data;

            return chain.run('after.' + method, context)
        })
        .then(function(context) {
            context.clearRoles();

            return context;
        });
};

AbstractTable.prototype.getAdapter = function() {
    if(this.adapter !== null) {
        var identifier = this.getIdentifier().clone();

        return this.getObject(identifier.setPath(['database', 'adapter']).setName(this.adapter));
    }

    return this.adapter;
};

AbstractTable.prototype.getColumns = function() {
    return this.getAdapter()
        .then(function(adapter) {
            return adapter.getSchema();
        })
        .then(function(schema) {
            return schema.columns;
        });
};

AbstractTable.prototype.getUniqueColumns = function() {
    var cols = [];

    return this.getColumns()
        .then(function() {
            for(var index in columns) {
                if(columns.hasOwnProperty(index)) {
                    var column = columns[index];

                    if(!column.autoinc && column.unique) {
                        cols.push(column);
                    }
                }
            }

            return cols;
        });
};

AbstractTable.prototype.getIdentityColumn = function() {
    return this.getColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns.hasOwnProperty(index)) {
                    var column = columns[index];

                    if(column.autoinc && column.unique) {
                        return column;
                    }
                }
            }
        });
};

// function array_flip(trans) {
//     var tmp_ar = {};
//
//     for (var key in trans) {
//         if (!trans.hasOwnProperty(key)) {
//             continue;
//         }
//         tmp_ar[trans[key]] = key;
//     }
//
//     return tmp_ar;
// }

module.exports = AbstractTable;
