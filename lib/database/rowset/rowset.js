var Base  = require('../../base/base');
var async   = require('async');
var util    = require('util');

function Rowset() {
    Base.apply(this, arguments);
    
    this.rows = [];
    console.log('Hello :D');
}

util.inherits(Rowset, Base);

Rowset.prototype.initialize = function(config) {
    var defer = Q.defer();
    var self = this;
    if(config.table) {
        this.table = config.table;
    }

    Base.prototype.initialize(config)
        .then(function(rowset) {
            defer.resolve(self);
        });

    return defer.promise;
};

Rowset.prototype.setData = function (data) {
    var defer = Q.defer();
    var self = this;

    async.each(data, function(item, next) {
        self.getRow()
            .then(function(row) {
                return row.setData(item);
            })
            .then(function(row) {
                self.rows.push(row);
                next();
            });
    }, function(err) {
        defer.resolve(self);
    });

    return defer.promise;
};

Rowset.prototype.getData = function() {
    var defer = Q.defer();
    var self = this;
    var data = [];

    async.each(self.rows, function(item, next) {
        item.getData()
            .then(function(rowData) {
                data.push(rowData);
                next();
            });
    }, function(err) {
        defer.resolve(data);
    });

    return defer.promise;
};

Rowset.prototype.getRow = function (callback) {
    var identifier = this.getIdentifier().clone();
    
    return this.getObject(identifier.setPath(['database', 'row']), {
        table: this.table
    });
};

module.exports = Rowset;