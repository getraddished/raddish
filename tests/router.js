var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var raddish     = require('../index.js');
var router      = new raddish.Router();

// Set faux url for testing.
request.url = '/home/menu/items';

describe('Router tests', function() {
    describe('#parseRequest()', function() {
        it('should return a parsed request', function(done) {
            var req = router.parseRequest(request)[0];

            should(req.url).be.an.instanceOf(Object);
            should(req.url.query).should.be.an.instanceOf(Object);
            done();
        });
    });
});