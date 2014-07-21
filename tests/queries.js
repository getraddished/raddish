require('./base');
var Query = require('../lib/database/query/query');

var mysql = Query.getType('mysql');
var mongo = Query.getType('mongo');

describe('MySQL query tests', function() {
    it('Should return a valid SQL Query', function(done) {
        mysql.select().table('foo_bar').toQuery()
            .should.equal('SELECT * FROM `foo_bar`');
        
        mysql.select().table('foo_bar').columns(['bar', 'baz']).toQuery()
            .should.equal('SELECT `bar`, `baz` FROM `foo_bar`');
        
        mysql.select().table('foo_bar', 'tbl').columns('tbl.*').toQuery()
            .should.equal('SELECT `tbl`.* FROM `foo_bar` AS `tbl`');

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl`');

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).join('inner', 'bar_baz', 'tbl.bar = bar_baz.baz').toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl` INNER JOIN `bar_baz` ON (`tbl`.`bar` = `bar_baz`.`baz`)');

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).join('inner', 'bar_baz', 'tbl.bar = bar_baz.baz').limit(10).toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl` INNER JOIN `bar_baz` ON (`tbl`.`bar` = `bar_baz`.`baz`) LIMIT 10');
        
        done();
    });
});