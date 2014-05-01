require('./base');

var View = Service.get('home:menu.view.json', {
    request: request,
    response: response
});

describe('View tests', function() {
    describe('constructor values', function() {
        it('test various values', function(done) {
            View.then(function(view) {
                view.getIdentifier().should.be.an.Object;
                view.response.getHeader('Content-Type').should.equal('application/json');

                done();
            });
        });
    });
});