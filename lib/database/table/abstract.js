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
    Filter          = require('../../filter/filter');

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

    this._schema            = undefined;
    this._identity_column   = '';
    this._column_map        = {};
    this._filters           = {};
    this.methods            = ['select', 'insert', 'update', 'delete'];
}

util.inherits(AbstractTable, ObjectManager);

function array_flip(trans) {
    var key, tmp_ar = {};

    if (trans && typeof trans === 'object' && trans.change_key_case) {
        return trans.flip();
    }

    for (key in trans) {
        if (!trans.hasOwnProperty(key)) {
            continue;
        }
        tmp_ar[trans[key]] = key;
    }

    return tmp_ar;
}

module.exports = AbstractTable;
