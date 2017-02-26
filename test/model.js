'use strict';

var ObjectManager = require('../index').ObjectManager,
    model = ObjectManager.get('com://demo/demo.model.demo');

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
                   console.log(item.getData());

                   item.should.be.an.Object;
                   Object.keys(item.getData()).length.should.equal(0);
               });
        });
    });
});