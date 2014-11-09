var Raddish = require('../index');
Raddish.setConfig('./tests/config.json');
should      = require('should');

describe('Plugin tests', function() {
    describe('Various plugin tests', function() {
        it('plugin.get should have a plugins array', function(done) {
            var plugin = new Raddish.Plugin();
            plugin.get('application.socketable')
                .then(function(plugins) {
                    plugins.plugins.should.be.an.Array;
                    plugins.plugins.length.should.equal(1);

                    done();
                });
        });

        it('Should return another array', function(done) {
            var plugin = new Raddish.Plugin();
            plugin.get('application')
                .then(function(plugins) {
                    plugins.plugins.should.be.an.Array;
                    plugins.plugins.length.should.equal(2);

                    done();
                });
        });

        it('Should return another array containing just one plugin.', function(done) {
            var plugin = new Raddish.Plugin();
            plugin.get('application.test')
                .then(function(plugins) {
                    plugins.plugins.length.should.equal(1);

                    done();
                });
        });
    });
})