'use strict';

var ObjectManager = require('../../../../index').ObjectManager;

function DemoComponent(request, response) {
    return ObjectManager.get('com://demo/demo.dispatcher.http')
        .then(function(dispatcher) {
            return dispatcher.execute('dispatch', {request: request, response: response});
        });
}

module.exports = DemoComponent;