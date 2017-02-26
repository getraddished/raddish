'use strict';

var raddish = require('../index').getInstance();

require('should');

raddish.setConfig(__dirname + '/config.json')
    .preStart()
    .registerApplication(__dirname + '/test_app/app');