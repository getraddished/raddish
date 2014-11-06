require('./base');
var Query = require('../lib/database/query/query');

var mysql = Query.getType('mysql');
var mongo = Query.getType('mongo');

describe('MySQL query tests', function() {
    it('Should return a valid select SQL Query', function(done) {
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

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).join('inner', 'bar_baz', 'tbl.bar = bar_baz.baz').limit(10).offset(10).toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl` INNER JOIN `bar_baz` ON (`tbl`.`bar` = `bar_baz`.`baz`) LIMIT 10 OFFSET 10');

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).where('tbl.bar', '=', '10').toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl` WHERE `tbl`.`bar` = \'10\'');

        mysql.select().table('foo_bar', 'tbl').columns(['tbl.bar', 'tbl.baz']).order('tbl.bar').toQuery()
            .should.equal('SELECT `tbl`.`bar`, `tbl`.`baz` FROM `foo_bar` AS `tbl` ORDER BY `tbl`.`bar` ASC');

        done();
    });

    it('Should return a valid update SQL Query', function(done) {
        mysql.update().table('foo_bar').set('bar', 'baz').toQuery()
            .should.equal('UPDATE `foo_bar` SET `bar` = \'baz\'');

        mysql.update().table('foo_bar').set('bar', 'baz').where('bar', '=', 'ba').toQuery()
            .should.equal('UPDATE `foo_bar` SET `bar` = \'baz\' WHERE `bar` = \'ba\'');

        done();
    });

    it('Should return a valid insert SQL Query', function(done) {
        mysql.insert().table('foo_bar').set('bar', 'baz').toQuery()
            .should.equal('INSERT INTO `foo_bar` (`bar`) VALUES (\'baz\')');

        done();
    });

    it('Should return a valid delete SQL Query', function() {
        mysql.delete().table('foo_bar').where('bar', '>', 20).toQuery()
            .should.equal('DELETE FROM `foo_bar` WHERE `bar` > \'20\'');
    });
});

describe('Mongo query tests', function() {
    it('Should return a valid select Mongo Query', function() {
        mongo.select().table('foo_bar').columns(['bar', 'baz']).toQuery()
            .should.be.an.Object;

        mongo.select().table('foo_bar').columns(['bar', 'baz']).getMethod()
            .should.equal('find');

        mongo.select().table('foo_bar').columns(['bar', 'baz']).getTable()
            .should.equal('foo_bar');

        mongo.select().table('foo_bar').columns(['bar', 'baz']).getColumns()
            .should.be.an.Array;

        mongo.select().table('foo_bar').columns(['bar', 'baz']).where('bar', '<', 20).toQuery()
            .bar.should.equal(20);

        mongo.select().table('foo_bar').columns(['bar', 'baz']).where('bar.hello', '<', 20).toQuery()
            .bar.should.be.an.Object;

        mongo.select().table('foo_bar').columns(['bar', 'baz']).where('bar.hello', '<', 20).toQuery()
            .bar.hello.should.equal(20);

        mongo.select().table('foo_bar').columns(['bar', 'baz']).limit(20).getLimit()
            .should.equal(20);

        mongo.select().table('foo_bar').columns(['bar', 'baz']).offset(10).getOffset()
            .should.equal(10);
    });

    it('Should return a valid update Mongo Query', function() {
        mongo.update().table('foo_bar').set('bar', 20).toQuery()
            .should.be.an.Object;

        mongo.update().table('foo_bar').set('bar', 20).toQuery()
            .bar.should.equal(20);

        mongo.update().table('foo_bar').set('bar', 20).getMethod()
            .should.equal('save');
    });

    it('Should return a valid insert Mongo Query', function() {
        mongo.update().table('foo_bar').set('bar', 20).toQuery()
            .should.be.an.Object;

        mongo.update().table('foo_bar').set('bar', 20).toQuery()
            .bar.should.equal(20);

        mongo.update().table('foo_bar').set('bar', 20).getMethod()
            .should.equal('save');
    });

    it('Should return a valid delete Mongo Query', function() {
        mongo.delete().table('foo_bar').where('bar', '=', 20).toQuery()
            .should.be.an.Object;

        mongo.delete().table('foo_bar').where('bar', '=', 20).toQuery()
            .bar.should.equal(20);

        mongo.delete().table('foo_bar').where('bar', '=', 20).getMethod()
            .should.equal('remove');
    });
});