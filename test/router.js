'use strict';

var Router = require('../index').Router,
    url = require('url'),
    response = {
        data: null,
        end: function(data) {
            data.should.equal('{"data":[],"states":{"test":{"filter":"int","unique":false,"value":null}}}');
            done();
        },
        statusCode: null,
        setHeader: function(header, value) {
        }
    };

require('should');

describe('Router tests', function() {
    describe('Basic Tests', function() {
        it('Should hold basic methods', function() {
            Router.addRoute.should.be.a.Function;
            Router.route.should.be.a.Function
            Router.routeRequest.should.be.a.Function
            Router.serveFile.should.be.a.Function
            Router.setPublicPath.should.be.a.Function
        });

        it('Should set the public path', function() {
            Router.setPublicPath('./public');
            Router.publicPath.should.equal('./public');
        });

        it('Should have 3 routes defined by default', function() {
            Router.routes.length.should.equal(3);
        })
    });

    describe('Route tests', function() {
        it('Should return the matched route', function() {
            var route = Router.match('/app/component');
            route.path.should.equal('/{application}/{component}');

            route = Router.match('/app/component/view');
            route.path.should.equal('/{application}/{component}/{view}');

        });

        it('Should add a custom route', function() {
            Router.addRoute('/index.html', {
                _redirect: '/test/index.html'
            });
            Router.routes.length.should.equal(4);

            Router.match('/index.html').options._redirect.should.equal('/test/index.html');
        });

        it('Should successfully parse a route', function() {
            var req = {
                    method: 'get',
                    headers: {
                        'content-length': 0
                    },
                    url: 'http://localhost:1338/app/component/view',
                    on: function(event, callback) {
                        if(event === 'end') {
                            callback(null, null);
                        }

                        return this;
                    }
                },
                route = Router.routes[0];

            return route
                .execute(req)
                .then(function(request) {
                    request.path.should.equal('/app/component/view');
                    request.query.application.should.equal('app');
                });
        });

        it('Should correctly route a request', function(done) {
            var response = {
                    data: null,
                    end: function (data) {
                        data.should.equal('{"data":[],"states":{"test":{"filter":"int","unique":false,"value":null}}}');
                        done();
                    },
                    statusCode: null,
                    setHeader: function (header, value) {
                    }
                },
                req = {
                    method: 'get',
                    headers: {
                        'content-length': 0
                    },
                    url: 'http://localhost:1338/demo/demo/demos',
                    on: function(event, callback) {
                        if(event === 'end') {
                            callback(null, null);
                        }

                        return this;
                    }
                };

            Router.route(req, response);
        });
    });
});