/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
Promise                     = global.Promise || require('bluebird');

module.exports              = require('./lib/raddish/raddish');
module.exports.Application  = require('./lib/application/application');
module.exports.Plugin       = require('./lib/plugin/plugin');
module.exports.Router       = require('./lib/router/router');