require('./base');
var id = 0;

describe('Row tests', function() {
    describe('#save()', function() {
        it('It should return an object with an ID set.', function(done) {
            ObjectManager.get('com://home/menu.database.row.item')
                .then(function(row) {
                    return row.setData({
                        title: 'Test_Demo',
                        component: 'Test_Demo'
                    });
                })
                .then(function(row) {
                    return row.save()
                })
                .then(function(row) {
                    return row.getData();
                })
                .then(function(data) {
                    data.id.should.be.an.Integer;

                    id = data.id;

                    done();
                });
        });
    });

    describe('#load()', function() {
        it('Should return an empty Row object', function(done) {
            ObjectManager.get('com://home/menu.database.row.item')
                .then(function(row) {
                    return row.load();
                })
                .then(function(row) {
                    row.isNew().should.be.true;
                    (row.getData().id === null).should.be.true;

                    done();
                });
        });
    });

    describe('#update()', function() {
        it('Should update the received row object.', function(done) {
            ObjectManager.get('com://home/menu.database.row.item')
                .then(function(row) {
                    return row.setData({
                        id: id
                    });
                })
                .then(function(row) {
                    return row.load();
                })
                .then(function(row) {
                    row.isNew().should.equal(false);

                    return row.setData({
                        title: 'blaat'
                    });
                })
                .then(function(row) {
                    return row.save();
                })
                .then(function(row) {
                    row.getData().title.should.equal('blaat');
                    row.getData().id.should.equal(id);

                    done();
                });
        });
    });

    describe('#delete()', function() {
        // We will set the data manually, when the item is received by the
        it('Should return the object of the deleted item', function(done) {
            ObjectManager.get('com://home/menu.database.row.item')
                .then(function(row) {
                    return row.setData({
                        id: id
                    });
                })
                .then(function(row) {
                    return row.load();
                })
                .then(function(row) {
                    return row.delete();
                })
                .then(function(row) {
                    row.should.be.an.Object;

                    done();
                });
        });
    });
});