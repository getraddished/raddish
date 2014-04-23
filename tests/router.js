var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var raddish     = require('../index.js');
var Service     = new raddish.Service();
var router      = new raddish.Router();

// Set faux url for testing.
request.url = '/home/menu/items';

describe('Router tests', function() {
    describe('#parseRequest()', function() {
        it('should return a parsed request', function(done) {
            var req = router.parseRequest(request);

            req.url.should.be.an.instanceOf(Object);
            req.url.query.should.be.an.instanceOf(Object);
            done();
        });
    });
});