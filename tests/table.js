var should      = require('should');
var raddish     = require('../index.js');
var base        = new raddish.Base();

describe('Table tests', function() {
    describe('new Table()', function() {
        it('name = foo_bar should return an error table not found.', function(done) {
            base.getObject('core:database.table.table', {
                    name: 'foo_bar'
                })
                .then(function(table) {
                    console.log(table);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
});