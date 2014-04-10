var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var raddish     = require('../index.js');
var base        = new raddish.Base();
var router      = new raddish.Router();

// Set faux url for testing.
request.url = '/home/menu/items';
request = router.parseRequest(request);

describe('Base loader tests.', function() {
    describe('#getObject().', function() {
        it('The identifier home:menu.model.items should return a Model object', function(done) {
            base.getObject('home:menu.model.items', null)
                .then(function(model) {
                    model.should.be.an.instanceOf(raddish.Model);

                    done();
                });
        });

        it('The identifier home:menu.controller.items should return a Controller object', function(done) {
            base.getObject('home:menu.controller.items', {
                    request: request
                })
                .then(function(controller) {
                    controller.should.be.an.instanceOf(raddish.Controller);

                    done();
                });
        });
    });

    describe('#getConfig()', function() {
        it('parameter db should give back an database config object and should have property default', function() {
            base.getConfig('db').should.be.an.instanceOf(Object).and.have.property('default');
        });

        it('parameter layout should return the default layout (JSON)', function() {
            base.getConfig('layout').should.equal('json');
        });
    });
});