/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
Promise                                     = global.Promise || require('bluebird');
Raddish                                     = require('./lib/raddish/raddish');

module.exports                              = Raddish;
module.exports.Application                  = require('./lib/application/application');
