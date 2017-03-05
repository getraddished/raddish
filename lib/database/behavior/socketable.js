'use strict';

var Socket = require('../../socket/socket'),
    Behavior = require('../../command/behavior'),
    Inflector = require('raddish-inflector');

/**
 * The socketable is an internally integrated behavior.
 * It will bind to SocketIO to allow for real time data, and make it integratable in your application.
 *
 * @class Socketable
 */
class Socketable extends Behavior {
    _afterInsert(context) {
        this._sendData('insert', context);

        return Promise.resolve(context);
    }

    _afterUpdate(context) {
        // Get the item identifier.
        this._sendData('update', context);

        return Promise.resolve(context);
    }

    _afterDelete(context) {
        this._sendData('delete', context);

        return Promise.resolve(context);
    }

    _sendData(method, context) {
        var listIdentifier = this._getRoomIdentifier(context, false),
            itemIdentifier = this._getRoomIdentifier(context, true);

        Socket.io.to(listIdentifier).emit(method, context.row.data);
        Socket.io.to(itemIdentifier).emit(method, context.row.data);
    }

    _getRoomIdentifier(context, isSingular) {
        var data = context.row.data,
            identifier = context.caller.getIdentifier(),
            roomIdentifier = identifier.getApplication() + ':' + identifier.getPackage(),
            name = identifier.getName();

        if(isSingular) {
            roomIdentifier = [roomIdentifier, Inflector.singularize(name), data.id].join('.');
        } else {
            roomIdentifier = [roomIdentifier, Inflector.pluralize(name)].join('.');
        }

        return roomIdentifier;
    }
}

module.exports = Socketable;