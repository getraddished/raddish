"use strict";

var Socketio = require('socket.io');

/**
 * Socket object which allows to communicate over sockets.
 * By default SocketIO is supported
 *
 * @class Socket
 * @constructor
 */
function Socket() {
    this.io = undefined;
}

/**
 * This method starts the SocketIO Server.
 * When socketio is enabled this will be done automatically.
 *
 * By default there are two events:
 * - Register
 *      Used to register to a specific room
 *
 * - Unregister
 *      Used to unregister from a specific room
 *
 * @method start
 */
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

/**
 * This method add an event listener with custom logic.
 *
 * @param {String} event The event name
 * @param {Method} funct The function to execute on that event
 */
Socket.prototype.addListener = function(event, funct) {
    this.io.sockets.on('connection', function(socket) {
        socket.on(event, funct);
    });
};

module.exports = new Socket();