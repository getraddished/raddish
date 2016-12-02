var ObjectManager = require('../../object/manager'),
    util = require('util');

function AbstractTable(config) {
    ObjectManager.call(this, config);
}

util.inherits(AbstractTable, ObjectManager);

AbstractTable.prototype.getRow = function() {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['database', 'row']);

    return this.getObject(identifier);
};

AbstractTable.prototype.getRowset = function() {
    var identifier = this.getIdentifier()
        .clone()
        .setPath(['database', 'rowset']);

    return this.getObject(identifier);
};

module.exports = AbstractTable;