"use strict";

var Socketio = require('socket.io');

/**
 * This is a wrapper class around SocketIO,
 * it adds convenience methods and late-binding of listeners.
 *
 * @class Socket
 */
class Socket {
    constructor() {
        this.io = null
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
     * @param {Number} port The port to start SocketIO on.
     */
    start(port) {
        this.io = new Socketio(port);

        this.io.on('connection', function(socket) {
            socket.on('register', function(room) {
                socket.join(room);
            });

            socket.on('unregister', function(room) {
                socket.leave(room);
            });
        });

        this.io.listen(port);
    }

    /**
     * Stop the SocketIO server
     *
     * @method stop
     */
    stop() {
        this.io.close(function() {
            console.log('Server closed!');
        });
    }

    /**
     * This method add an event listener with custom logic.
     *
     * @method addListener
     * @param {String} event The event name
     * @param {Function} funct The function to execute on that event
     */
    addListener(event, funct) {
        if(this.io) {
            this.io.sockets.on('connection', function (socket) {
                socket.on(event, funct);
            });
        }
    }
}

module.exports = new Socket();