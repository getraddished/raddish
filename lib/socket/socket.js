var Socketio = require('socket.io');

function Socket() {
    this.io = undefined;
}

Socket.prototype.start = function() {
    var port = Raddish.getConfig('socketio.port') || 1338;
    var self = this;

    this.io = new Socketio(port);

    this.io.on('connection', function(socket) {
        socket.on('register', function(room) {
            socket.join(room);
        });

        socket.on('unregister', function(room) {
            socket.leave(room);
        });
    });
};

Socket.prototype.addListener = function(event, funct) {
    this.io.sockets.on('connection', function(socket) {
        socket.on(event, funct);
    });
};

module.exports = new Socket();