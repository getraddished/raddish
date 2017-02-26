'use strict';

var Filter = require('../index').Filter;

describe('Filter tests', function() {
    describe('Basic filter tests', function() {
        it('Should have a sanitize method', function() {
            Filter.getFilter('ascii').sanitize.should.be.a.Function;
            Filter.getFilter('boolean').sanitize.should.be.a.Function;
            Filter.getFilter('cmd').sanitize.should.be.a.Function;
            Filter.getFilter('date').sanitize.should.be.a.Function;
            Filter.getFilter('email').sanitize.should.be.a.Function;
            Filter.getFilter('int').sanitize.should.be.a.Function;
            Filter.getFilter('json').sanitize.should.be.a.Function;
            Filter.getFilter('md5').sanitize.should.be.a.Function;
            Filter.getFilter('raw').sanitize.should.be.a.Function;
            Filter.getFilter('slug').sanitize.should.be.a.Function;
            Filter.getFilter('string').sanitize.should.be.a.Function;
        });
        
        it('Should have a validate method', function() {
            Filter.getFilter('ascii').validate.should.be.a.Function;
            Filter.getFilter('boolean').validate.should.be.a.Function;
            Filter.getFilter('cmd').validate.should.be.a.Function;
            Filter.getFilter('date').validate.should.be.a.Function;
            Filter.getFilter('email').validate.should.be.a.Function;
            Filter.getFilter('int').validate.should.be.a.Function;
            Filter.getFilter('json').validate.should.be.a.Function;
            Filter.getFilter('md5').validate.should.be.a.Function;
            Filter.getFilter('raw').validate.should.be.a.Function;
            Filter.getFilter('slug').validate.should.be.a.Function;
            Filter.getFilter('string').validate.should.be.a.Function;
        });
    });

    describe('Basic functionality tests', function() {
        it('Various validate tests', function() {
            // MD5
            Filter.getFilter('md5').validate('ABDEF19906').should.be.false();
            Filter.getFilter('md5').validate('098f6bcd4621d373cade4e832627b4f6').should.be.true();

            // String
            Filter.getFilter('string').validate(123).should.be.false();
            Filter.getFilter('string').validate('123').should.be.true();

            // json
            Filter.getFilter('json').validate('json:variable').should.be.false();
            Filter.getFilter('json').validate('{"json":"variable"}').should.be.true();

            // int
            Filter.getFilter('int').validate('123').should.be.false();
            Filter.getFilter('int').validate(123).should.be.true();

            // email
            Filter.getFilter('email').validate('jasper@jvar').should.be.false();
            Filter.getFilter('email').validate('jasper@jvar.nl').should.be.true();

            // boolean
            Filter.getFilter('boolean').validate('true').should.be.false();
            Filter.getFilter('boolean').validate(true).should.be.true();
            Filter.getFilter('boolean').validate(false).should.be.true();

            // date
            Filter.getFilter('date').validate('2017-01-01').should.be.false();
            Filter.getFilter('date').validate(new Date('01-01-2017')).should.be.true();
        });

        it('Various sanitize tests', function() {
            // MD5
            Filter.getFilter('md5').sanitize('12345').should.equal('12345');

            // string
            Filter.getFilter('string').sanitize(12345).should.equal('12345');

            // int
            Filter.getFilter('int').sanitize('12345').should.equal(12345);

            // data
            Filter.getFilter('date').sanitize('2017-01-01').should.be.a.Date;

            // email
            Filter.getFilter('email').sanitize('jasper[()@jvar.nl').should.equal('jasper@jvar.nl');

            Filter.getFilter('boolean').sanitize(true).should.equal(true);
            Filter.getFilter('boolean').sanitize(false).should.equal(false);
            Filter.getFilter('boolean').sanitize('1').should.equal(true);
            Filter.getFilter('boolean').sanitize(0).should.equal(false);
            Filter.getFilter('boolean').sanitize(1).should.equal(true);
            Filter.getFilter('boolean').sanitize(10).should.equal(true);
        })
    });
});