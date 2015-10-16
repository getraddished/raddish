/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
Promise                                     = global.Promise || require('bluebird');
RaddishError                                = require('./lib/error/error');
ObjectManager                               = require('./lib/object/manager');
ObjectLoader                                = require('./lib/object/loader/loader');
Raddish                                     = require('./lib/raddish/raddish');
Socket                                      = require('./lib/socket/socket')
Log                                         = require('./lib/log/log');

module.exports                              = Raddish;
module.exports.Authenticator                = require('./lib/dispatcher/authenticator/default');
module.exports.Application                  = require('./lib/application/application');
module.exports.Behavior                     = require('./lib/command/behavior/behavior');
module.exports.Controller                   = require('./lib/controller/default');
module.exports.Filter                       = require('./lib/filter/filter');
module.exports.HttpDispatcher               = require('./lib/dispatcher/http');
module.exports.Inflector                    = require('./lib/inflector/inflector');
module.exports.Log                          = Log;
module.exports.Mixin                        = require('./lib/mixin/mixin');
module.exports.Model                        = require('./lib/model/default');
module.exports.ModelAbstract                = require('./lib/model/abstract');
module.exports.ObjectLoader                 = ObjectLoader;
module.exports.ObjectManager                = ObjectManager;
module.exports.Permission                   = require('./lib/controller/permission/default');
module.exports.Plugin                       = require('./lib/plugin/plugin');
module.exports.RaddishError                 = RaddishError;
module.exports.Router                       = require('./lib/router/router');
module.exports.Row                          = require('./lib/database/row/default');
module.exports.RowAbstract                  = require('./lib/database/row/abstract');
module.exports.Rowset                       = require('./lib/database/rowset/default');
module.exports.RowsetAbstract               = require('./lib/database/rowset/abstract');
module.exports.Socket                       = Socket;
module.exports.Table                        = require('./lib/database/table/default');
module.exports.ViewJson                     = require('./lib/view/json');
module.exports.ViewFile                     = require('./lib/view/file');
module.exports.ViewAbstract                 = require('./lib/view/abstract');
