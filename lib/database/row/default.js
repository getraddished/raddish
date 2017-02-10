'use strict';

var AbstractRow = require('./abstract');

class DefaultRow extends AbstractRow {
    save() {
        var self = this,
            save = super.save.bind(this);

        if(this.modified.length <= 0 && !this._isNew) {
            return this;
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

    delete() {
        var self = this,
            parent = super.delete.bind(this);

        if(this._isNew) {
            return super.delete();
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