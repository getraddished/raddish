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

Row.prototype.initialize = function(config, callback) {
    var self = this;
    if(config.table) {
        this.table = config.table;
    }

    return new Promise(function(resolve, reject) {
        Base.prototype.initialize(config)
            .then(function(row) {
                resolve(self);
            });
    });
};

Row.prototype.setData = function (data, callback) {
    var self = this;
    var length = Object.keys(this.data).length;

    return new Promise(function(resolve, reject) {
        if(length > 0) {
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

Row.prototype.getData = function (callback) {
    var self = this;

    return new Promise(function(resolve, reject) {
        resolve(self.data);
    });
};

Row.prototype.isNew = function() {
    return this.new;
};

Row.prototype.save = function(callback) {
    if(this.new) {
        var query = squel.insert()
        query.into(this.table.getName());

        for(var index in this.data) {
            query.set(index, this.data[index]);
        };

        return this.table.insert(query, callback);
    } else {
        var self = this;
        var query = squel.update()
        query.table(this.table.getName());

        for(var index in this.modified) {
            query.set(index, this.modified[index]);
        };

        // Still have to fetch the states.
        this.table.getUniqueColumns(function(columns) {
            for(var index in columns) {
                query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
            }

            return self.table.update(query, callback);
        });
    }
};

Row.prototype.delete = function(callback) {
    var self = this;
    var query = squel.delete()
    query.from(this.table.getName());

    // Still have to fetch the states.
    this.table.getUniqueColumns(function(columns) {
        for(var index in columns) {
            query.where(columns[index].Field + ' = ?', self.data[columns[index].Field]);
        }

        return self.table.update(query, callback);
    });
};

module.exports = Row;