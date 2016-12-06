/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
module.exports                      = require('./lib/raddish/raddish');
module.exports.Application          = require('./lib/application/application');
module.exports.HttpDispatcher       = require('./lib/dispatcher/http');
module.exports.ObjectManager        = require('./lib/object/manager');
module.exports.Plugin               = require('./lib/plugin/plugin');
module.exports.Router               = require('./lib/router/router');

module.exports.AbstractController   = require('./lib/controller/abstract');
module.exports.DefaultController    = require('./lib/controller/default');

module.exports.AbstractModel        = require('./lib/model/abstract');
module.exports.DefaultModel        = require('./lib/model/default');