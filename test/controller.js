'use strict';

var ObjectManager = require('../index').ObjectManager,
    controller = ObjectManager.get('com://demo/demo.controller.demo');

require('should');

describe('Controller tests', function() {
    describe('Basic controller methods/ properties', function() {
        it('Should return a valid controller object', function() {
            return controller
                .then(function(controller) {
                    controller.getView.should.be.a.Function;
                    controller.getModel.should.be.a.Function;
                    controller.getPermissions.should.be.a.Function;
                    controller.execute.should.be.a.Function;
                });
        });
    });

    describe('Basic functionality tests', function() {
        it('Should return a correct model Object', function() {
            return controller
                .then(function(controller) {
                    return controller.getModel();
                })
                .then(function(model) {
                    model.getItem.should.be.a.Function;
                    model.state.should.be.a.Function;
                    model.getList.should.be.a.Function;
                    model.getTable.should.be.a.Function;
                });
        });
    });
});