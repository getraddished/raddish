var should      = require('should');
var Raddish     = require('../index.js');
var Service     = Raddish.Service;

describe('Table tests', function() {
    describe('new Table()', function() {
        it('name = foo_bar should return an error table not found.', function(done) {
            Service.get('core:database.table.table', {
                    name: 'menu_items',
                    db: 'default'
                })
                .then(function(table) {
                    table.should.have.property('name', 'menu_items')
                    table.getIdentifier().toString().should.equal('core:database.table.table');

                    done();
                });
        });
    });
});