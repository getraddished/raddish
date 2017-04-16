'use strict';

var Raddish = require('../index'),
    Instance = Raddish.getInstance(),
    should = require('should');

describe('Raddish tests', function() {
    describe('Basic tests', function() {
        it('Should be a correct Raddish Object', function() {
            Raddish.getInstance.should.be.a.Function;
            Instance.registerApplication.should.be.a.Function;
            Instance.preStart.should.be.a.Function;
            Instance.start.should.be.a.Function;
            Instance.stop.should.be.a.Function;
            Instance.getConfig.should.be.a.Function;
            Instance.setConfig.should.be.a.Function;
        });

        it('Should start the server', function() {
            Instance.start(1338);
            Instance.server.should.not.be.null;
        });

        it('Should stop the server', function() {
            Instance.stop();
            should(Instance.server).be.null;
        });
    });
});