var ObjectManager   = require('../../object/manager'),
    util            = require('util'),
    Inflector       = require('../../inflector/inflector');

function TableAbstract(config) {
    ObjectManager.call(this, config);

    this.methods = ['select', 'insert', 'update', 'delete'];
}

util.inherits(TableAbstract, ObjectManager);

/**
 * This method will execute a certain command combined with a context.
 * This method will also call specialized for the selected method.
 * The methods callable are: Select, Insert, Update and Delete.
 *
 * @param {String} method The method to execute.
 * @param {CommandContext} context The context object to use in this call.
 */
TableAbstract.prototype.execute = function(method, context) {
    var self = this;
    method = method.toLowerCase();

    if(this.methods.indexOf(method) === -1) {
        throw new RaddishError(500, 'method is not supported');
    }

    return this.getCommandChain()
        .then(function(chain) {
            return [chain, chain.run('initialize.' + method, context)];
        })
        .spread(function(chain, context) {
            return chain.run('before.' + method, context);
        })
        .then(function(context) {
            return self['_before' + Inflector.capitalize(method)](context);
        })
        .then(function(context) {
            return [self.getAdapter(), context];
        })
        .spread(function(adapter, context) {
            return adapter.execute(context.query);
        })
        .then(function(data) {
            context.result = data;

            return [self.getCommandChain(), self['_after' + Inflector.capitalize(method)](context)];
        })
        .spread(function(chain, context) {
            return chain.run('after.' + method, context);
        })
        .then(function(context) {
            return context.result;
        });
};

TableAbstract.prototype._beforeSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterSelect = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterInsert = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterUpdate = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._beforeDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

TableAbstract.prototype._afterDelete = function(context) {
    throw new RaddishError(404, 'Not Implemented');
};

/**
 * This method returns the name of the table.
 *
 * @method getName
 * @returns {string} Table name
 */
TableAbstract.prototype.getName = function () {
    return this.name;
};

/**
 * This method will return the adapter associated with the current table object
 *
 * @method getAdapter
 * @returns {Promise} The associated adapter.
 */
TableAbstract.prototype.getAdapter = function() {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'adapter']).setName(this.adapter))
        .then(function(adapter) {
            return adapter.getInstance(self.db, self.db_config);
        });
};

/**
 * This method will return an empty Row object
 * Here we will also cache the Row object for later use.
 *
 * @method getRow
 * @returns {Promise} Returns a Row object
 */
TableAbstract.prototype.getRow = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return self.getObject(identifier.setPath(['database', 'row']), {
        table: self
    });
};

/**
 * This method will return an empty Rowset object
 *
 * @method getRowset
 * @returns {Promise} Returns a Rowset object
 */
TableAbstract.prototype.getRowset = function () {
    var self = this;
    var identifier = this.getIdentifier().clone();

    return this.getObject(identifier.setPath(['database', 'rowset']), {
        table: self
    });
};

/**
 * Returns all the columns of the table
 *
 * @method getColumns
 * @returns {Promise} The columns of the table.
 */
TableAbstract.prototype.getColumns = function () {
    var self = this;

    return this.getSchema()
        .then(function(schema) {
            schema.columns = self.mapColumns(schema.columns, true);

            return schema.columns;
        });
};

/**
 * This method will return the unique columns of the table
 *
 * @method getUniqueColumns
 * @returns {Promise} The unique columns of the table.
 */
TableAbstract.prototype.getUniqueColumns = function () {
    var self = this;
    var fields = {};

    return self.getColumns()
        .then(function(columns) {
            for(var index in columns) {
                if(columns[index] && columns[index].unique) {
                    fields[index] = columns[index];
                }
            }

            return fields;
        });
};

/**
 * This method will return the single identity column, identified by the auto_increment value.
 *
 * @method getIdentityColumn
 * @returns {Promise} The promise with the identity column.
 */
TableAbstract.prototype.getIdentityColumn = function() {
    var self = this;

    if(self._identity_column) {
        return self._identity_column;
    }

    return self.getUniqueColumns()
        .then(function(columns) {
            // There is only one column with auto_increment
            for(var index in columns) {
                if(columns[index].autoinc) {
                    return columns[index].name;
                }
            }
        });
};

/**
 * This Method will check if the table exists or not, if not, it will return an error.
 *
 * @method getSchema
 * @returns {Promise} The promise with the complete schema.
 */
TableAbstract.prototype.getSchema = function() {
    var self = this;

    return self.getAdapter()
        .then(function(adapter) {
            return adapter.getSchema(self.getName());
        });
};

/**
 * This method will translate table columns to their original values, or visa versa.
 * This will work on the column_map variable.
 *
 * @method mapColumns
 * @param object
 * @private
 */
TableAbstract.prototype.mapColumns = function(object, reverse) {
    var map = reverse ? array_flip(this._column_map) : this._column_map;

    if(object instanceof Object) {
        for(var index in object) {
            if(map[index]) {
                object[map[index]] = object[index];
                delete object[index];
            }
        }
    }

    return object;
};

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

module.exports = TableAbstract;