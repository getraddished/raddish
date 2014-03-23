var Base  = require('../../base/base');
var async   = require('async');
var util    = require('util');

function Rowset() {
    Base.apply(this, arguments);
    
    this.rows = [];
}

util.inherits(Rowset, Base);

Rowset.prototype.initialize = function(config) {
    var self = this;

    return new Promise(function(resolve, reject) {
        if(config.table) {
            this.table = config.table;
        }

        Base.prototype.initialize(config)
            .then(function(rowset) {
                resolve(self);
            });
        });
};

Rowset.prototype.setData = function (data) {
    var self = this;

    return new Promise(function(resolve, reject) {
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
            resolve(self);
        });
    });
};

Rowset.prototype.getData = function() {
    var self = this;
    var data = [];

    return new Promise(function(resolve, reject) {
        async.each(self.rows, function(item, next) {
            item.getData()
                .then(function(rowData) {
                    data.push(rowData);
                    next();
                });
        }, function(err) {
            resolve(data);
        });
    });
};

Rowset.prototype.getRow = function (callback) {
    var identifier = this.getIdentifier().clone();
    
    return this.getObject(identifier.setPath(['database', 'row']), {
        table: this.table
    });
};

module.exports = Rowset;