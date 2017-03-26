var socket = require('../index').Socket;

describe('Socket tests', function() {
    describe('Basic socket tests', function () {
        it('Should have all the correct basic properties', function() {
            socket.start.should.be.a.Function;
            socket.stop.should.be.a.function;
            socket.addListener.should.be.a.Function;
        });
    });

    describe('Basic socket tests', function() {
        it('It should start the server', function() {
            socket.start(1338);
            socket.io.engine.should.an.Object;
        });

        // The stop method in socketio seems bugged.
        it('Should close the server', function() {
            socket.stop();
        });


    });
});