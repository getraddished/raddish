'use strict';

var ObjectManager = require('../index').ObjectManager,
    AbstractTable = require('../index').AbstractTable,
    AbstractRow = require('../index').AbstractRow,
    row = ObjectManager.get('com://demo/demo.database.row.demo');

require('should');

describe('Row tests', function() {
    describe('Basic row tests', function() {
        it('Should be a correct row object', function() {
            return row
                .then(function(row) {
                    row.should.be.instanceOf(AbstractRow);
                });
        });

        it('Should return the correct "new" status', function() {
            return row
                .then(function(row) {
                    row._isNew.should.be.true();
                    row.isNew().should.be.true();
                    row.isNew(false).should.be.false();
                    row.isNew(true).should.be.true();
                });
        });

        it('Should set the data correctly', function() {
            return row
                .then(function(row) {
                    row.setData({
                        hello: 'world'
                    });

                    row.data.hello.should.equal('world');
                });
        });

        it('Should update the modified object', function() {
            return row
                .then(function(row) {
                    row.setData({
                        hello: 'world'
                    });
                    row.setData({
                        hello: 'foo'
                    });

                    row.data.hello.should.equal('foo');
                    row.modified.should.containEql('hello');
                });
        });

        it('Should return false when isNew is called after save', function() {
            return row
                .then(function(row) {
                    return row.save();
                })
                .then(function(row) {
                    row.should.be.instanceOf(AbstractRow);
                    row.isNew().should.be.false();
                });
        });

        it('Should return a correct table object', function() {
            return row
                .then(function(row) {
                    return row.getTable();
                })
                .then(function(table) {
                    table.should.be.instanceOf(AbstractTable);
                });
        });

        it('Should return a correct row object after delete', function() {
            return row
                .then(function(row) {
                    return row.delete();
                })
                .then(function(row) {
                    row.should.be.instanceOf(AbstractRow);
                });
        });
    });
});