/**
 * This is the main file.
 * This object holds the config and more data.
 */
var config = null;

function Raddish() {

}

/**
 * This method sets the config and all of its values.
 *
 * @param {String/ Object/ undefined} conf
 * @returns {Raddish} the current object for chaining.
 */
Raddish.prototype.setConfig = function(conf) {
    if(typeof conf == 'string') {
        config = require(conf);
    } else if(typeof conf == 'object') {
        config = conf;
    } else {
        config = require(process.cwd() + '/config.json');
    }

    return this;
}

module.exports = new Raddish();