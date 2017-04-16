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

        it('Should set the public path', function() {
            Router.setPublicPath('./public');
            Router.publicPath.should.equal('./public');
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

        it('Should add a custom route', function() {
            Router.addCustomRoute('/index.html', '/test/index.html');
            Router.routes['/index.html'].should.equal('/test/index.html');
        });

        it('Should set multiple custom routes', function() {
            Router.addCustomRoute({
                '/index2.html': '/test/index.html',
                '/index3.html': '/test/index.html'
            });

            Router.routes['/index2.html'].should.equal('/test/index.html');
            Router.routes['/index3.html'].should.equal('/test/index.html');
        });

        it('Should correctly route a request', function(done) {
            var response = {
                data: null,
                end: function(data) {
                    data.should.equal('{"data":[],"states":{"test":{"filter":"int","unique":false,"value":null}}}');
                    done();
                },
                statusCode: null,
                setHeader: function(header, value) {
                }
            };

            Router.route({
                method: 'get',
                headers: {
                    'content-length': 0
                },
                url: 'http://localhost:1338/demo/demo',
                on: function(event, callback) {
                    if(event === 'end') {
                        callback(null, null);
                    }

                    return this;
                }
            }, response)
        });
    });
});