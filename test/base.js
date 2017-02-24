var raddish = require('../index').getInstance();

require('should');

raddish.setConfig(__dirname + '/config.json');
raddish.preStart();