var AbstractAdapter = require('./abstract');
var util            = require('util');
var sqlite          = require('sqlite3');
var query           = require('../query/query');
var instances       = {};
var Filter          = require('../../filter/filter');

function SqliteAdapter(config, connection) {
    // At this moment sqlite isn't supported with streams.
    if(Raddish.getConfig('stream')) {
        throw new RaddishError('The sqlite doesn\'t support streams yet!');
    }

    AbstractAdapter.call(this, config);

    if(connection) {
        this.connection = Promise.promisifyAll(connection);
    }

    // Set the types.
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

    this.queryBuilder = query.getType('mysql');
}

util.inherits(SqliteAdapter, AbstractAdapter);

SqliteAdapter.prototype.getInstance = function(name, config) {
    var self = this;

    if(instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        return new Promise(function(resolve, reject) {
            resolve(new sqlite.Database(config.host + '/' + config.database));
        }).then(function(connection) {

            instances[name] = new SqliteAdapter({
                identifier: self.getIdentifier()
            }, connection);

            return instances[name];
        }).catch(function(error) {
            throw new RaddishError(500, error.message);
        });
    }
};

SqliteAdapter.prototype.getSchema = function(name) {
    var result  = {};
    var self    = this;

    return this.connection.allAsync('PRAGMA table_info(' + name + ')')
        .each(function(column) {
            result[column.name] = {
                name: column.name,
                unique: column.pk,
                autoinc: column.pk,
                value: column.dflt_value,
                type: self.getType(column.type),
                filter: Filter.getFilter(self.getType(column.type))
            };
        })
        .then(function(columns) {
            // We only serve the columns on this one.
            return {columns: result};
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });
};

SqliteAdapter.prototype.execute = function(query) {
    return this.connection.allAsync(query.toQuery())
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });
};

SqliteAdapter.prototype.getType = function(type) {
    type = type.toLowerCase();

    if(type.indexOf('(') > -1) {
        type = type.split('(')[0];
    }

    return this.types[type];
};

module.exports = SqliteAdapter;