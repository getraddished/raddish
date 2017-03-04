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
});