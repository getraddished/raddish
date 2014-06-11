var Socketio = require('socket.io');

function Socket() {
    this.io = undefined;
}

Socket.prototype.start = function() {
    var config = Raddish.getConfig();
    var port = 1338;
    var self = this;

    if(config.socketio.port) {
        port = config.socketio.port;
    }

    this.io = new Socketio(port);

    this.io.on('connection', function(socket) {
        console.log('user is connected');

        socket.on('register', function(room) {
            console.log('Called register');
            socket.join(room);
        });

        socket.on('unregister', function(room) {
            console.log('Called unregister');
            socket.leave(room);
        });
    });

    console.log('Socket.io started on port: ' + port);
};

module.exports = new Socket();