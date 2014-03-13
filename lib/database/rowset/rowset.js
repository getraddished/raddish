var Base  = require('../../base/base');
var async   = require('async');
var util    = require('util');

function Rowset() {
    Base.apply(this, arguments);
    
    this.rows = [];
}

util.inherits(Rowset, Base);

Rowset.prototype.initialize = function(config, callback) {
    if(config.table) {
        this.table = config.table;
    }

    Rowset.super_.prototype.initialize.call(this, config, callback);
};

Rowset.prototype.setData = function (data, callback) {
    var self = this;
    
    async.each(data, function(item, next) {
        self.getRow(function (row) {
            row.setData(item, function (row) {
                row.new = false;

                self.rows.push(row);
                next();
            });
        });
    }, function(err) {
        callback(self);
    });
};

Rowset.prototype.getData = function(callback) {
    var data = [];
    
    for(index in this.rows) {
        this.rows[index].getData(function (rowData) {
            data.push(rowData);
        });
    }
    
    callback(data);
};

Rowset.prototype.getRow = function (callback) {
    var identifier = this.getIdentifier().clone();
    
    this.getObject(identifier.setPath(['database', 'row']), {
        table: this.table
    }, callback);
};

module.exports = Rowset;