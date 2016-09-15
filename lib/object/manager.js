var Loader = require('raddish-loader').Loader,
    Identifier = require('raddish-loader').Identifier;

function ObjectManager() {

}

ObjectManager.prototype.getObject = function(identifier) {

};

// Proxy the get method to the getObject in the prototype.
ObjectManager.get = ObjectManager.prototype.getObject;

module.exports = ObjectManager;