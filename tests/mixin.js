require('./base');
var Mixin = require('../lib/mixin/mixin');

var One = new ObjectManager({
    identifier: 'home:menu.model.items'
});
var Two = new ObjectManager({
    identifier: 'home:content.model.articles'
});

Two.testOne = function() {
    console.log('testOne');
};

Two.testTwo = function() {
    console.log('testTwo');
};

describe('Mixin tests', function() {
    describe('#mix()', function() {
        it('One shouldn\'t have the function testOne after mixing', function(done) {
            Mixin.mix(One, Two);

            (One.testOne === undefined).should.be.true;
            done();
        });

        it('Should have the function testTwo after mixing', function(done) {
            Two.getMixableMethods = function() {
                return {
                    'testOne': this.testOne,
                    'testTwo': this.testTwo
                };
            };

            Mixin.mix(One, Two);
            One.testTwo.should.be.a.function;
            done();
        });
    });
});