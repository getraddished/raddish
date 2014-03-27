var Base    = require('../../base/base');
var util    = require('util');
var squel   = require('squel');

function Row() {
    Base.apply(this, arguments);
    
    this.data = {};
    this.modified = {}
    this.new = true;
}

util.inherits(Row, Base);

Row.prototype.initialize = function (config) {
    var self = this;

    return new Promise(function (resolve, reject) {
        if (config.table) {
            this.table = config.table;
        }

        Base.prototype.initialize(config)
            .then(function(row) {
                resolve(self);
            });
    });
};

Row.prototype.setData = function (data) {
    var self = this;
    var length = Object.keys(this.data).length;

    return new Promise(function(resolve, reject) {
        if (length > 0) {
            for(var index in data) {
                self.modified[index] = data[index];
                self.data[index] = data[index];
            }
        } else if(length <= 0) {
            self.data = data;
        }

        resolve(self);
    });
};

Row.prototype.getData = function () {
    var self = this;

    return new Promise(function(resolve, reject) {
        resolve(self.data);
    });
};

Row.prototype.isNew = function () {
    return this.new;
};

Row.prototype.save = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        var query = self.new ? squel.insert() : squel.update();
        self.new ? query.into(self.table.getName()) : query.table(self.table.getName());

        if(self.new) {

            for(var index in self.data) {
                query.set(index, self.data[index]);
            };

            self.table.insert(query)
                .then(function (data) {
                    resolve(data);
                });
        } else {

            for(var index in self.modified) {
                query.set(index, self.modified[index]);
            };

            self.table.getUniqueColumns()
                .then(function (columns) {
                    for(var index in columns) {
                        query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
                    }

                    return self.table.update(query);
                })
                .then(function (data) {
                    resolve(data);
                });
        }
    });
};

Row.prototype.delete = function () {
    var self = this;
    var query = squel.delete()
    query.from(this.table.getName());

    return new Promise(function (resolve, reject) {
        self.table.getUniqueColumns()
            .then(function (columns) {
                for(var index in columns) {
                    query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
                }

                return self.table.update(query);
            })
            .then(function (data) {
                resolve(data);
            });
    });
};

module.exports = Row;