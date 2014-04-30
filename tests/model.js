require('./base');
var Model = Service.get('home:menu.model.item');

describe('Model Tests', function() {
    describe('#getList()', function() {
        it('Should return a Promise Object', function() {
            Model.then(function(model) {
                model.getList().should.be.an.instanceOf(Promise);
            });
        });

        it('Should return a Rowset Object', function(done) {
            Model.then(function(model) {
                    return model.getList();
                })
                .then(function(list) {
                    list.should.be.an.instanceOf(Raddish.Rowset);

                    done();
                });
        });

        it('Should have a rows array', function(done) {
            Model.then(function(model) {
                    return model.getList();
                })
                .then(function(list) {
                    list.rows.should.be.an.Array;

                    done();
                });
        });
    });

    describe('#getItem()', function() {
        it('should return a Promise Object', function() {
            Model.then(function(model) {
                model.getItem().should.be.an.instanceOf(Promise);
            });
        });

        it('Should return a Row Object', function(done) {
            Model.then(function(model) {
                    model.set('id', 1);

                    return model.getItem();
                })
                .then(function(item) {
                    item.should.be.an.instanceOf(Raddish.Row);

                    done();
                });
        });

        it('Should have a data object', function(done) {
            Model.then(function(model) {
                    model.set('id', 1);

                    return model.getItem();
                })
                .then(function(item) {
                    item.data.should.be.an.Object;

                    done();
                });
        });
    });
});