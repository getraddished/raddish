require('./base');
var Row = ObjectManager.get('com://home/menu.database.row.item');
var id = 0;

describe('Row tests', function() {
    describe('#save()', function() {
        it('It should return an object with an ID set.', function(done) {
            Row
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
                    return row.data.getData();
                })
                .then(function(data) {
                    data.id.should.be.an.Integer;

                    id = data.id;

                    done();
                });
        });
    });

    describe('#delete()', function() {
        // We will set the data manually, when the item is received by the
        it('It should return the object of the delted item', function(done) {
            Row
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