var Inflector = require('../index').Inflector;
should = require('should');


describe('Various inflector tests', function() {
    it('Should return correct pluralizations', function() {
        Inflector.pluralize('person').should.equal('people');
        Inflector.pluralize('matrix').should.equal('matrices');
        Inflector.pluralize('formula').should.equal('formulae');
        Inflector.pluralize('buffalo').should.equal('buffaloes');
        Inflector.pluralize('alias').should.equal('aliases');
    });

    it('Should return a correct singular', function() {
        Inflector.singularize('people').should.equal('person');
        Inflector.singularize('axes').should.equal('axis');
        Inflector.singularize('aliases').should.equal('alias');
        Inflector.singularize('formulae').should.equal('formula');
        Inflector.singularize('matrices').should.equal('matrix');
    });

    it('Should return the correct definition', function() {
        Inflector.define('foo', 'bar');

        Inflector.pluralize('foo').should.equal('bar');
        Inflector.singularize('bar').should.equal('foo');
    });

    it('Should be uncountable', function() {
        Inflector.pluralize('money').should.equal('money');
        Inflector.singularize('money').should.equal('money');
    });

    it('Should return a capitalized word', function() {
        Inflector.capitalize('foo').should.equal('Foo');
    });
});