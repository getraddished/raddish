/**
 * This object will hold the command object, and thus hold is the main entry of the command design pattern.
 *
 * @class Command
 * @constructor
 */
function Command() {
    this.commands = {};
}

Command.prototype.store = function(object) {
    this.commands.push(object);
};

Command.prototype.execute = function(name, params) {

};

module.exports = Command;