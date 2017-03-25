'use strict';

var ObjectManager = require('../index').ObjectManager,
    model = ObjectManager.get('com://demo/demo.model.demo'),
    model2 = ObjectManager.get('com://demo/demo.model.test');

require('should');

describe('Model Tests', function() {
    describe('Basic model method/ property tests', function() {
        it('Should be a corect model object', function() {
            return model
                .then(function(model) {
                    model.getList.should.be.a.Function;
                    model.getItem.should.be.a.Function;
                    model.state.should.be.an.Object;
                });
        });
    });

    describe('Basic functionality tests', function() {
        it('getList should return an empty rowset object', function() {
            return model
                .then(function(model) {
                    return model.getList();
                })
                .then(function(list) {
                    list.should.be.an.Object;
                    list.getData().length.should.equal(0);
                });
        });

        it('getItem should return an empty row object', function() {
           return model
               .then(function(model) {
                   return model.getItem();
               })
               .then(function(item) {
                   item.should.be.an.Object;
                   Object.keys(item.getData()).length.should.equal(0);
               });
        });

        it('States should not be unique', function() {
            return model
                .then(function(model) {
                    model.state.isUnique().should.be.false;
                });
        });

        it('getTable should return a correct table object', function() {
            return model
                .then(function(model) {
                    return model.getTable()
                })
                .then(function(table) {
                    table.getUniqueColumns.should.be.a.Function;
                    table.getColumns.should.be.a.Function;
                    table.getName.should.be.a.Function;
                });
        });

        it('setState should set the states correctly', function() {
            return model
                .then(function(model) {
                    model
                        .state
                        .insert('id', 'int', true)
                        .insert('name', 'string');

                    model.setState({
                        id: '1'
                    }).setState('name', 'Jasper');

                    model.state.get('name').should.equal('Jasper');
                    model.state.get('id').should.equal(1);
                    model.state.get('unexisting').should.be.false();

                    model.state.isUnique().should.be.true();

                    model.state.insert('test', 'int', true);

                    model.state.isUnique().should.be.false();

                    model.state.states.name.should.be.an.Object;
                    model.state.states.id.should.be.an.Object;
                });
        });
    });

    describe('Advanced tests', function() {
        it('Should have a default state', function() {
            return model2
                .then(function(model) {
                    model.state.states['id'].unique.should.be.true();
                });
        });

        it('Should return a new item', function() {
            return model2
                .then(function(model) {
                    return model.getItem()
                })
                .then(function(item) {
                    item._isNew.should.be.true();
                });
        });

        it('Should return an existing item', function() {
            return model2
                .then(function(model) {
                    model.setState('id', 1);

                    return model.getItem();
                })
                .then(function(item) {
                    item._isNew.should.be.false();
                });
        });

        it('Should return an existing list', function() {
            return model2
                .then(function(model) {
                    model.setState('id', [1]);

                    return model.getList();
                })
                .then(function(list) {
                    console.log(list);
                });
        });
    });
});