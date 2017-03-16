'use strict';

var ObjectManager = require('../index').ObjectManager,
    view = ObjectManager.get('com://demo/demo.view.json');

describe('View tests', function() {
    describe('Basic Tests', function() {
        it('Should be a corect model object', function() {
            return view
                .then(function(view) {
                    view.contentType.should.equal('application/json');
                    view._actionRender.should.be.a.Function;
                    view.execute.should.be.a.Function;
                });
        });
    });

    describe('Advanced tests', function() {
        it('Should return correct data', function() {
            return view
                .then(function(view) {
                    return view.execute('render', {
                        data: {
                            getData: function() {
                                return {hello: 'world'}
                            }
                        },
                        model: {
                            state: {
                                states: [{
                                    some: 'states'
                                }]
                            }
                        }
                    });
                })
                .then(function(result) {
                    result.should.be.a.String;
                    result.should.equal('{"data":{"hello":"world"},"states":[{"some":"states"}]}');
                });
        });
    });
});