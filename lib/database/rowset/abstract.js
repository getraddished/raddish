var ObjectManager = require('../../object/manager'),
    util = require('util');

function AbstractRowset(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractRowset, ObjectManager);

AbstractRowset.prototype.getRow = function() {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['database', 'rowset']);

    return this.getObject(identifier);
};

AbstractRowset.prototype.save = function() {
    var promises = [];

    for(var index in this.rows) {
        if(this.rows.hasOwnProperty(index)) {
            promises.push(this.rows[index].save());
        }
    }

    return Promise.all(promises);
};

AbstractRowset.prototype.delete = function() {
    var promises = [];

    for(var index in this.rows) {
        if(this.rows.hasOwnProperty(index)) {
            promises.push(this.rows[index].delete());
        }
    }

    return Promise.all(promises);
};

AbstractRowset.prototype.createRow = function() {
    var self = this;
    
    return this.getRow()
        .then(function(row) {
            this.rows.push(row);

            return row;
        });
};

module.exports = AbstractRowset;