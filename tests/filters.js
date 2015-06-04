should = require('should');

function getFilter(filter) {
    var Obj = require('../lib/filter/' + filter);

    return new Obj();
}

describe('Filter Tests', function() {
    describe('Various validates.', function() {
        it('Test should return true.', function() {
            var filter = getFilter('string');

            filter.validate('Test').should.equal(true);
        });

        it('Should be a int', function() {
            var filter = getFilter('int');

            filter.validate(123456).should.be.true;
            filter.validate('1234').should.be.false;
        });

        it('should be a valid email address', function() {
            var filter = getFilter('email');

            filter.validate('jasper199069@live.nl').should.be.true;
            filter.validate('jasper199069').should.be.false;
            filter.validate('jasper199069@blaa').should.be.false;
            filter.validate('jasper199069@blaa.').should.be.false;
            filter.validate('jasper199069@blaa$$$.').should.be.false;
            filter.validate('jasper199069@blaa$$$.!@#$').should.be.false;
        });

        it('Should be correct JSON', function() {
            var filter = getFilter('json');

            filter.validate('p').should.be.false;
            filter.validate('{"hello": "world"}').should.be.true;
        });

        it('Should be a correct MD5', function() {
            var filter = getFilter('md5');

            filter.validate('88f931198d715c2a647644f70f45fa29').should.be.true;
        });

        it('Should be a correct slug.', function() {
            var filter = getFilter('slug');

            filter.validate('this-is-a-correct-slug').should.be.true;
            filter.validate('this is a incorrect slug').should.be.false;
            filter.validate('this-is-a-correct-slug!').should.be.false;
            filter.validate('This-Is-A-Correct-Slug').should.be.true;
        });

        it('Should be a correct string', function() {
            var filter = getFilter('ascii');

            filter.validate('this is a correct string').should.be.true;
            filter.validate('this is àn incorrect string').should.be.false;
        });
    });

    describe('Various sanatize Tests', function() {
        it('Should return a correct int', function() {
            var filter = getFilter('int');

            filter.sanitize('123').should.be.number;
            filter.sanitize(123).should.be.number;
        });

        it('Should return a clean email address', function() {
            var filter = getFilter('email');

            filter.sanitize('blaat199069!#@muhaha%^&.nl*()').should.equal('blaat199069@muhaha.nl');
            filter.sanitize('bla!#@blaat%^&.*(nl*()').should.equal('bla@blaat.nl');
        });

        it('Should return a correct MD5', function() {
            var filter = getFilter('md5');

            filter.sanitize('88f931198d715c2a647644f70f45fa29123798456439').should.equal('88f931198d715c2a647644f70f45fa29');
        });

        it('Should return a correct slug', function() {
            var filter = getFilter('slug');

            filter.sanitize('This is an invalid Slug').should.equal('this-is-an-invalid-slug');
        });

        it('Should return correct JSON', function() {
            var filter = getFilter('json');

            filter.sanitize('p').should.equal('"p"');
            filter.sanitize({hello: 'world'}).should.equal('{"hello":"world"}');
        });

        it('Should return a correct string', function() {
            var filter = getFilter('ascii');

            filter.sanitize('this is auml;n incorrect string').should.equal('this is aen incorrect string');
        });

        it('Should return a correct command', function() {
            var filter = getFilter('cmd');

            filter.sanitize('whoam@#$i').should.equal('whoami');
            filter.sanitize('who am i').should.equal('whoami');
        })
    });
});