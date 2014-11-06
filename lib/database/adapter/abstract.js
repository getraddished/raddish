"use strict";

var ObjectManager   = require('../../object/manager');
var util            = require('util');
var instances       = {};
var filters         = [];

/**
 * Abstract database adapter class
 * This class is used for extending for your own adapters
 *
 * @class AbstractAdapter
 */
function AbstractAdapter(config) {
    this.queryBuilder = undefined;

    // Only use columns known in the database.
    this.strictColumns = true;

    this.types = {
        // Numeric
        'int'               : 'int',
        'integer'           : 'int',
        'bigint'            : 'int',
        'mediumint'			: 'int',
        'smallint'			: 'int',
        'tinyint'			: 'int',
        'numeric'			: 'int',
        'dec'               : 'int',
        'decimal'           : 'int',
        'float'				: 'int',
        'double'            : 'int',
        'real' 				: 'int',

        // boolean
        'bool'				: 'boolean',
        'boolean' 			: 'boolean',

        // date & time
        'date'              : 'date',
        'time'              : 'time',
        'datetime'          : 'int',
        'timestamp'         : 'int',
        'year'				: 'int',

        // string
        'national char'     : 'string',
        'nchar'             : 'string',
        'char'              : 'string',
        'binary'            : 'string',
        'national varchar'  : 'string',
        'nvarchar'          : 'string',
        'varchar'           : 'string',
        'varbinary'         : 'string',
        'text'				: 'string',
        'mediumtext'		: 'string',
        'tinytext'			: 'string',
        'longtext'			: 'string',

        // blob
        'blob'				: 'raw',
        'tinyblob'			: 'raw',
        'mediumblob'		: 'raw',
        'longblob'          : 'raw',

        //other
        'set'				: 'string',
        'enum'				: 'string',
    };

    ObjectManager.call(this, config);
};

util.inherits(AbstractAdapter, ObjectManager);

/**
 * This function will return a single instance,
 * if the instance isn't there it has to be created.
 *
 * @method getInstance
 * @param name
 * @param config
 */
AbstractAdapter.prototype.getInstance = function(name, config) {

};

/**
 * This function must return a query builder object, or sele when overridden.
 *
 * @method getQuery
 * @returns {undefined|*}
 */
AbstractAdapter.prototype.getQuery = function() {
    return this.queryBuilder;
};

module.exports = AbstractAdapter;