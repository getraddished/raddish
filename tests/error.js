require('./base');

describe('Error Tests', function() {
    describe('Throw new error', function() {
        it('Should return a valid Error object', function(done) {
            try {
                throw new RaddishError(500, 'Internal server error');
            } catch(error) {
                error.code.should.equal(500);
                error.message.should.equal('Internal server error');

                done();
            }
        });
    });

    describe('new error', function() {
        it('Should return a valid Error object', function(done) {
            var error = new RaddishError(500, 'Internal server error2');

            error.code.should.equal(500);
            error.message.should.equal('Internal server error2');

            done();
        });
    });
});