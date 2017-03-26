'use strict';

var AbstractRow = require('./abstract');

/**
 * This is the default row object which holds all the database related method.
 * When extending from this Object the row is granted database permissions.
 *
 * @class DefaultRow
 * @extends AbstractRow
 */
class DefaultRow extends AbstractRow {
    /**
     * This method will save the current Row object to the database.
     *
     * @method save
     * @return {Promise} A promise containing the saved Row Object.
     */
    save() {
        var self = this,
            save = super.save.bind(this);

        if(this.modified.length <= 0 && !this._isNew) {
            return Promise.resolve(this);
        }

        return this.getTable()
            .then(function(table) {
                var method = self._isNew ? 'insert' : 'update',
                    query = self._isNew ? table.getQuery().insert().into(table.getName()) : table.getQuery().update(table.getName()),
                    identityColumn = table.getIdentityColumn(),
                    data = {};

                if(!self._isNew) {
                    for(var modified of self.modified) {
                        data[modified] = self.data[modified];
                    }
                } else {
                    data = self.data;
                }

                // Map the columns.
                table.mapColumns(data);

                return table.filterColumns(data)
                    .then(function(columns) {
                        for(var index in columns) {
                            if(columns.hasOwnProperty(index)) {
                                query.set(index, data[index]);
                            }
                        }

                        if(!self._isNew) {
                            query.where(identityColumn).is(self.data.id);
                        }

                        return table.execute(method, {
                            query: query,
                            row: self
                        });
                    });
            })
            .then(function() {
                self.modified = {};

                return save();
            });
    }

    /**
     * This method will try to remove a single item from the database.
     *
     * @return {Promise} A promise containing the deleted Row object.
     */
    delete() {
        var self = this,
            parent = super.delete.bind(this);

        if(this._isNew) {
            return parent();
        }

        return this.getTable()
            .then(function(table) {
                var query = table.getQuery().delete().from(table.getName()),
                    identityColumn = table.getIdentityColumn();

                query.where(identityColumn).is(self.data[identityColumn]);

                return table.execute('delete', {
                    query: query,
                    row: self
                });
            })
            .then(function() {
                return parent();
            });
    }
}

module.exports = DefaultRow;