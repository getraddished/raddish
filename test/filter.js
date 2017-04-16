'use strict';

var Filter = require('../index').Filter;

describe('Filter tests', function() {
    describe('Basic filter tests', function() {
        it('Should have a sanitize method', function() {
            Filter.get('boolean').sanitize.should.be.a.Function;
            Filter.get('cmd').sanitize.should.be.a.Function;
            Filter.get('date').sanitize.should.be.a.Function;
            Filter.get('email').sanitize.should.be.a.Function;
            Filter.get('int').sanitize.should.be.a.Function;
            Filter.get('json').sanitize.should.be.a.Function;
            Filter.get('md5').sanitize.should.be.a.Function;
            Filter.get('raw').sanitize.should.be.a.Function;
            Filter.get('slug').sanitize.should.be.a.Function;
            Filter.get('string').sanitize.should.be.a.Function;
        });
        
        it('Should have a validate method', function() {
            Filter.get('boolean').validate.should.be.a.Function;
            Filter.get('cmd').validate.should.be.a.Function;
            Filter.get('date').validate.should.be.a.Function;
            Filter.get('email').validate.should.be.a.Function;
            Filter.get('int').validate.should.be.a.Function;
            Filter.get('json').validate.should.be.a.Function;
            Filter.get('md5').validate.should.be.a.Function;
            Filter.get('raw').validate.should.be.a.Function;
            Filter.get('slug').validate.should.be.a.Function;
            Filter.get('string').validate.should.be.a.Function;
        });
    });

    describe('Basic functionality tests', function() {
        it('Should return an error when the filter does not exist', function() {
            try {
                Filter.get('ascii');
            } catch(err) {
                err.should.be.an.instanceOf.Error;
            }
        });

        it('Various validate tests', function() {
            // Abstract
            try {
                Filter.get('abstract').validate('ABDEF19906').should.be.false();
            } catch(err) {
                err.should.be.an.instanceOf.Error;
            }

            // MD5
            Filter.get('md5').validate('ABDEF19906').should.be.false();
            Filter.get('md5').validate('098f6bcd4621d373cade4e832627b4f6').should.be.true();
            Filter.get('md5').validate(12345).should.be.false();

            // CMD
            Filter.get('cmd').validate('This is a string').should.be.false();
            Filter.get('cmd').validate('node-gyp').should.be.true();

            // String
            Filter.get('string').validate(123).should.be.false();
            Filter.get('string').validate('123').should.be.true();

            // Slug
            Filter.get('slug').validate('this is an incorrect slug').should.be.false();
            Filter.get('slug').validate('this-is-a-correct-slug').should.be.true();

            // json
            Filter.get('json').validate('json:variable').should.be.false();
            Filter.get('json').validate('{"json":"variable"}').should.be.true();
            Filter.get('json').validate({json:"variable"}).should.be.true();
            Filter.get('json').validate(null).should.be.false();

            // int
            Filter.get('int').validate('123').should.be.false();
            Filter.get('int').validate(123).should.be.true();

            // email
            Filter.get('email').validate('jasper@jvar').should.be.false();
            Filter.get('email').validate('jasper@jvar.nl').should.be.true();

            // boolean
            Filter.get('boolean').validate('true').should.be.false();
            Filter.get('boolean').validate(true).should.be.true();
            Filter.get('boolean').validate(false).should.be.true();

            // date
            Filter.get('date').validate('2017-01-01').should.be.false();
            Filter.get('date').validate(new Date('01-01-2017')).should.be.true();

            // Raw
            Filter.get('raw').validate('test').should.be.true();
            Filter.get('raw').validate([]).should.be.true();
            Filter.get('raw').validate({}).should.be.true();
            Filter.get('raw').validate(null).should.be.true();
            Filter.get('raw').validate(false).should.be.true();
        });

        it('Various sanitize tests', function() {
            // Abstract
            try {
                Filter.get('abstract').sanitize('ABDEF19906').should.be.false();
            } catch(err) {
                err.should.be.an.instanceOf.Error;
            }

            // MD5
            Filter.get('md5').sanitize('12345').should.equal('12345');

            //CMD
            Filter.get('cmd').sanitize('this is a string').should.equal('thisisastring');
            Filter.get('cmd').sanitize('node-gyp').should.equal('node-gyp');

            // string
            Filter.get('string').sanitize(12345).should.equal('12345');

            // int
            Filter.get('int').sanitize('12345').should.equal(12345);

            // Slug
            Filter.get('slug').sanitize('this is an incorrect slug').should.equal('this-is-an-incorrect-slug');
            Filter.get('slug').sanitize('this-is-a-correct-slug').should.equal('this-is-a-correct-slug');

            // data
            Filter.get('date').sanitize('2017-01-01').should.be.a.Date;

            // JSON
            Filter.get('json').sanitize(null).should.equal("null");

            // email
            Filter.get('email').sanitize('jasper[()@jvar.nl').should.equal('jasper@jvar.nl');

            // boolean
            Filter.get('boolean').sanitize(true).should.equal(true);
            Filter.get('boolean').sanitize(false).should.equal(false);
            Filter.get('boolean').sanitize('1').should.equal(true);
            Filter.get('boolean').sanitize(0).should.equal(false);
            Filter.get('boolean').sanitize(1).should.equal(true);
            Filter.get('boolean').sanitize(10).should.equal(true);

            // raw
            Filter.get('raw').sanitize('test').should.equal('test');
            Filter.get('raw').sanitize(true).should.equal(true);
            Filter.get('raw').sanitize(false).should.equal(false);
        })
    });
});