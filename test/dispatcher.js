'use strict';

var ObjectManager = require('../index').ObjectManager,
    dispatcher = ObjectManager.get('com://demo/demo.dispatcher.http');

require('should');

describe('Dispatcher tests', function() {
    describe('Basic object tests', function() {
        it('Should return a valid dispatcher object', function() {
            return dispatcher
                .then(function(dispatcher) {
                    dispatcher.should.be.an.Object;
                    dispatcher.execute.should.be.a.Function;
                    dispatcher.getController.should.be.a.Function;

                    dispatcher.authenticator.should.equal('basic');
                });
        });
    });

    describe('Basic functionality tests', function() {
        it('Should return a correct controller Object', function() {
            return dispatcher
                .then(function(dispatcher) {
                    return dispatcher.getController('demos', 'json');
                })
                .then(function(controller) {
                    controller.getView.should.be.a.Function;
                    controller.getModel.should.be.a.Function;
                });
        });

        it('Should return a valid authenticator', function() {
            return dispatcher
                .then(function(dispatcher) {
                    return dispatcher.getAuthenticator();
                })
                .then(function(authenticator) {
                    authenticator.authenticate.should.be.a.Function;
                });
        });
    });
});