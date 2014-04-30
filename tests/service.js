var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var Raddish     = require('../index.js');
var Service     = Raddish.Service;
var router      = new Raddish.Router();

Raddish.setConfig('./config.json');
Raddish.setApplication('home', '../../test/apps/home/app.js');

// Set faux url for testing.
request.url = '/home/menu/items';
request = router.parseRequest(request)[0];

describe('Service loader tests.', function() {
    describe('#getObject().', function() {
        it('The identifier home:menu.model.items should return a Model object', function(done) {
            Service.get('home:menu.model.items', null)
                .then(function(model) {
                    model.should.be.an.instanceOf(Raddish.Model);

                    done();
                });
        });

        it('The identifier home:menu.controller.items should return a Controller object', function(done) {
            Service.get('home:menu.controller.items', {
                    request: request
                })
                .then(function(controller) {
                    controller.should.be.an.instanceOf(Raddish.Controller);

                    done();
                });
        });

        it('Should return a Table object', function(done) {
            Service.get('home:menu.database.table.items')
                .then(function(table) {
                    table.should.be.an.instanceOf(Raddish.Table);

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