require('./base');

describe('View tests', function() {
    describe('constructor values', function() {
        it('test various values', function(done) {
            ObjectManager.get('com://home/menu.view.json')
                .then(function(view) {
                    view.getIdentifier().should.be.an.Object;
                    view.mimetype.should.equal('application/json');
    
                    done();
                });
        });
    });
});