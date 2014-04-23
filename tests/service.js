var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var Raddish     = require('../index.js');
var Service     = Raddish.Service;
var router      = new Raddish.Router();
Raddish.setConfig(require('./config.js'));

// Set faux url for testing.
request.url = '/home/menu/items';
request = router.parseRequest(request);

describe('Service loader tests.', function() {
    describe('#getObject().', function() {
        it('The identifier home:menu.model.items should return a Model object', function(done) {
            Service.get('core:model.model', null)
                .then(function(model) {
                    model.should.be.an.instanceOf(raddish.Model);

                    done();
                });
        });

        it('The identifier home:menu.controller.items should return a Controller object', function(done) {
            Service.get('core:controller.controller', {
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
            Raddish.getConfig('db').should.be.an.instanceOf(Object).and.have.property('default');
        });

        it('parameter layout should return the default layout (JSON)', function() {
            Raddish.getConfig('layout').should.equal('json');
        });
    });
});