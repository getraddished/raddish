'use strict';

var AbstractRow = require('./abstract');

/**
 * This is the default row object which holds all the database related method.
 * When extending from this Object the row is granted database permissions.
 *
 * @class DefaultRow
 */
class DefaultRow extends AbstractRow {
    /**
     * This method will save the current Row object to the database.
     *
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
                    query = self._isNew ? table.getQueryBuilder().insert().into(table.getName()) : table.getQueryBuilder().update(table.getName()),
                    identityColumn = table.getIdentityColumn();

                if(!self._isNew) {
                    for(var modified of self.modified) {
                        query.set(modified, self.data[modified]);
                    }

                    query.where(identityColumn).is(self.data[identityColumn]);
                } else {
                    for(var index in self.data) {
                        if(self.data.hasOwnProperty(index)) {
                            query.set(index, self.data[index]);
                        }
                    }
                }

                return table.execute(method, {
                    query: query,
                    row: self
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
                var query = table.getQueryBuilder().delete().from(table.getName()),
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