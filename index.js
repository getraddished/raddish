/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
module.exports                          = require('./lib/raddish/raddish');

/**********************/
/** Abstract objects **/
/**********************/

module.exports.AbstractAuthenticator    = require('./lib/dispatcher/authenticator/abstract');
module.exports.AbstractController       = require('./lib/controller/abstract');
module.exports.AbstractDispatcher       = require('./lib/dispatcher/abstract');
module.exports.AbstractModel            = require('./lib/model/abstract');
module.exports.AbstractTable            = require('./lib/database/table/abstract');
module.exports.AbstractRow              = require('./lib/database/row/abstract');
module.exports.AbstractRowset           = require('./lib/database/rowset/abstract');
module.exports.AbstractView             = require('./lib/view/abstract');
module.exports.BasicAuthenticator       = require('./lib/dispatcher/authenticator/basic');

/*********************/
/** Default objects **/
/*********************/

module.exports.DefaultController        = require('./lib/controller/default');
module.exports.DefaultModel             = require('./lib/model/default');
module.exports.DefaultTable             = require('./lib/database/table/default');
module.exports.DefaultRow               = require('./lib/database/row/default');
module.exports.DefaultRowset            = require('./lib/database/rowset/default');
module.exports.JsonView                 = require('./lib/view/json');
module.exports.Behavior                 = require('./lib/command/behavior');

/********************/
/** Usable objects **/
/********************/

module.exports.Application              = require('./lib/application/application');
module.exports.HttpDispatcher           = require('./lib/dispatcher/http');
module.exports.ObjectManager            = require('./lib/object/manager');
module.exports.Plugin                   = require('./lib/plugin/plugin');
module.exports.Router                   = require('./lib/router/router');
module.exports.CommandChain             = require('./lib/command/chain');
module.exports.Socket                   = require('./lib/socket/socket');
module.exports.Filter                   = require('./lib/filter/filter');