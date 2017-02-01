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
                    query = table.adapter.getBuilder(),
                    query = self._isNew ? query.insert().into(table.getName()) : query.update(table.getName()),
                    identity_column = table.getIdentityColumn();

                if(!self._isNew) {
                    for(var modified of self.modified) {
                        query.set(modified, self.data[modified]);
                    }

                    query.where(identity_column).is(self.data[identity_column]);
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
            .then(function(context) {
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
                var query = table.adapter.getBuilder().delete().from(table.getName()),
                    identity_column = table.getIdentityColumn();

                query.where(identity_column).is(self.data[identity_column]);

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