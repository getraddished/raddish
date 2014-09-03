require('./base');
var should      = require('should');
var http        = require('http');
var request     = new http.IncomingMessage();
var raddish     = require('../index.js');
var router      = new raddish.Router();
var MockReq     = require('mock-req');
var MockRes     = require('mock-res');

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

    describe('#route()', function() {
        it('Should return a filled response parsable by JSON.parse', function(done) {
            // This will up our score a lot.
            // But first I have to check it it is going to work.
            var request = new MockReq({
                method: 'GET',
                url: '/home/menu/items',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            var response = new MockRes();
            response.on('finish', function() {
                if(response._getJSON()) {
                    done();
                }
            });

            router.route(request, response);
        });
    });
});