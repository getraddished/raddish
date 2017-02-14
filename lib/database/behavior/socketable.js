var Socket = require('../../socket/socket'),
    Behavior = require('../../command/behavior'),
    Inflector = require('raddish-inflector');

class Socketable extends Behavior {
    _afterInsert(context) {
        this._sendData('insert', context);

        console.log('Called Insert');

        return Promise.resolve(context);
    }

    _afterUpdate(context) {
        // Get the item identifier.
        this._sendData('update', context.row.data);

        return Promise.resolve(context);
    }

    _afterDelete(context) {
        this._sendData('delete', context.row.data);

        return Promise.resolve(context);
    }

    _sendData(method, context) {
        var listIdentifier = this._getRoomIdentifier(context, false),
            itemIdentifier = this._getRoomIdentifier(context, true);

        console.log(listIdentifier);
        console.log(itemIdentifier);

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