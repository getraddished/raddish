var ObjectManager = require('../index').ObjectManager,
    AbstractTable = require('../index').AbstractTable,
    AbstractRow = require('../index').AbstractRow,
    AbstractRowset = require('../index').AbstractRowset,
    rowset = ObjectManager.get('com://demo/demo.database.rowset.demo');

describe('Rowset tests', function() {
    describe('Basic rowset tests', function () {
        it('Should be a correct rowset object', function () {
            return rowset
                .then(function(rowset) {
                    rowset.should.be.an.instanceOf(AbstractRowset);
                });
        });

        it('Should return a correct row object', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.getRow();
                })
                .then(function(row) {
                    row.should.be.an.instanceOf(AbstractRow);
                });
        });

        it('Should return a correct table object', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.getTable();
                })
                .then(function(table) {
                    table.should.be.an.instanceOf(AbstractTable);
                });
        });

        it('Should return an empty rows array when data is not an array', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.setData({
                        hello: 'world'
                    });
                })
                .then(function(rowset) {
                    rowset.rows.length.should.equal(0);
                });
        });

        it('Should set the data correctly', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.setData([{
                        hello: 'world'
                    }, {
                        foo: 'bar'
                    }]);
                })
                .then(function(rowset) {
                    rowset.rows[0].data.hello.should.equal('world');
                    rowset.rows[1].data.foo.should.equal('bar');
                });
        });

        it('Should return a correct data array', function() {
            return rowset
                .then(function(rowset) {
                    rowset.getData().should.be.an.instanceOf(Array);
                    rowset.getData()[0].hello.should.equal('world');
                });
        });

        it('Should force the new state to all containing rows', function() {
            return rowset
                .then(function(rowset) {
                    rowset.isNew(false);
                    rowset.rows[0]._isNew.should.be.false();

                    rowset.isNew(true);
                    rowset.rows[0]._isNew.should.be.true();
                });
        });

        it('Should return the rowset after all the rows are saved', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.save();
                })
                .then(function(rowset) {
                    rowset.should.be.an.instanceOf(AbstractRowset);
                    rowset.rows[0]._isNew.should.be.false();
                });
        });

        it('Should return the rowset after all the rows are deleted', function() {
            return rowset
                .then(function(rowset) {
                    return rowset.delete();
                })
                .then(function(rowset) {
                    rowset.should.be.an.instanceOf(AbstractRowset);
                });
        });
    });
});