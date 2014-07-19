require('./base');

describe('Table tests', function() {
    describe('Constructor values', function() {
        it('Test various values', function(done) {
            ObjectManager.get('com://home/menu.database.table.items')
                .then(function(table) {
                    table.should.have.property('name', 'menu_items')
                    table.getIdentifier().toString().should.equal('com://home/menu.database.table.items');

                    table.getRow().should.be.an.instanceOf(Promise);
                    table.getRowset().should.be.an.instanceOf(Promise);

                    done();
                });
        });
    });

    describe('#getRow()', function() {
        it('Should return a Row object', function(done) {
            ObjectManager.get('com://home/menu.database.table.items')
                .then(function(table) {
                    return table.getRow();
                })
                .then(function(row) {
                    row.should.be.an.instanceOf(Raddish.Row);

                    done();
                });
        });
    });

    describe('#getRowset()', function() {
        it('Should return a Rowset object', function(done) {
            ObjectManager.get('com://home/menu.database.table.items')
                .then(function(table) {
                    return table.getRowset();
                })
                .then(function(rowset) {
                    rowset.should.be.an.instanceOf(Raddish.Rowset);

                    done();
                });
        });
    });
});