'use strict';

var Router = require('../index').Router,
    url = require('url');

require('should');

describe('Router tests', function() {
    describe('Basic Tests', function() {
        it('Should hold basic methods', function() {
            Router.addParseRule.should.be.a.Function;
            Router.setPublicPath.should.be.a.Function
            Router.addCustomRoute.should.be.a.Function
            Router.route.should.be.a.Function
            Router.parseRoutes.should.be.a.Function
        });
    });

    describe('Route tests', function() {
        it('Should return the correct route', function() {
            var route = Router.parseRoutes(url.parse('/', true)),
                route2 = Router.parseRoutes(url.parse('/demo/demo', true));

            route.pathname.should.equal('/index.html');
            route2.query.application.should.equal('demo');
            route2.query.component.should.equal('demo');
        });
    });
});