require('./base');

describe('Various ObjectManager tests', function() {
    describe('Require objects with different config', function() {
        it('should have a different config', function(done) {
            ObjectManager.get('com://home/menu.database.table.items')
                .then(function(table) {
                    ObjectManager.get('com://home/menu.database.table.items', {
                        name: 'bank_accounts'
                    }).then(function(other) {
                        table.getName().should.equal('menu_items');
                        other.getName().should.equal('bank_accounts');

                        done();
                    });
                });
        });
    });
});