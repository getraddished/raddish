require('./base');

var View = ObjectManager.get('com://home/menu.view.json');

describe('View tests', function() {
    describe('constructor values', function() {
        it('test various values', function(done) {
            View.then(function(view) {
                view.getIdentifier().should.be.an.Object;
                view.mimetype.should.equal('application/json');

                done();
            });
        });
    });
});