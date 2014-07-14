/**
 * This file has been created to get the basics.
 * Here a the config will be set and a faux request will be created.
 */

// Raddish will register a global variable.
require('../index');

Raddish.setConfig('./tests/config.json');
Raddish.setApplication('home', 'tests/apps/demo/app.js');

// Local variables.
var http        = require('http');
var Request     = new http.IncomingMessage();
var Response    = new http.OutgoingMessage();
var Post        = new http.IncomingMessage();

// Global variables to make the tests less populated.
should          = require('should');
Request.url     = '/home/menu/items';
Post.url        = '/home/menu/item?id=1';

request         = new Raddish.Router().parseRequest(Request)[0];
response        = Response;