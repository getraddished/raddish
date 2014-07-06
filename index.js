/**
 * Provides base classes from which can be extended
 *
 * @module raddish
 * @author Jasper van Rijbroek <jasper@jvar.nl>
 * @since 28 March 2014
 */
Promise                                     = require('bluebird');
RaddishError                                = require('./lib/error/raddish');
Service                                     = require('./lib/service/service');
Raddish                                     = require('./lib/raddish/raddish');
Socket                                      = require('./lib/socket/socket')

module.exports                              = Raddish;
module.exports.AbstractContollerBehavior    = require('./lib/controller/behavior/abstract');
module.exports.AbstractTableBehavior        = require('./lib/database/table/behavior/abstract');
module.exports.Application                  = require('./lib/application/application');
module.exports.Router                       = require('./lib/router/router');
module.exports.HttpDispatcher               = require('./lib/dispatcher/http');
module.exports.Controller                   = require('./lib/controller/default');
module.exports.ViewJson                     = require('./lib/view/json');
module.exports.ViewAbstract                 = require('./lib/view/abstract');
module.exports.Mixin                        = require('./lib/mixin/mixin');
module.exports.Model                        = require('./lib/model/default');
module.exports.ModelAbstract                = require('./lib/model/abstract');
module.exports.Table                        = require('./lib/database/table/default');
module.exports.Row                          = require('./lib/database/row/default');
module.exports.RowAbstract                  = require('./lib/database/row/abstract');
module.exports.Rowset                       = require('./lib/database/rowset/default');
module.exports.RowsetAbstract               = require('./lib/database/rowset/abstract');
module.exports.Permission                   = require('./lib/controller/permission/default');
module.exports.Plugin                       = require('./lib/plugin/plugin');
module.exports.RaddishError                 = RaddishError;
module.exports.Service                      = Service;
module.exports.Socket                       = Socket;

module.exports.Inflector                    = require('./lib/inflector/inflector');