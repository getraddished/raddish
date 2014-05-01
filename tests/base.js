/**
 * This file has been created to get the basics.
 * Here a the config will be set and a faux request will be created.
 */

// Raddish will register a global variable.
require('../index.js');

Raddish.setConfig('./config.json');
Raddish.setApplication('home', '../../test/apps/home/app.js');

// Local variables.
var http        = require('http');
var Request     = new http.IncomingMessage();
var Response    = new http.ServerResponse();

// Global variables to make the tests less populated.
should = require('should');
Request.url = '/home/menu/items';
request = new Raddish.Router().parseRequest(Request)[0];
response = Response;