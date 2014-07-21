// Normally you would require raddish here.
var Application = require('../../../index').Application;
var util        = require('util');

function DemoApp() {
    DemoApp.super_.call(this);
    
    this.setConfig({
        component: __dirname + '/components',
        config: __dirname + '/config'
    });
}

util.inherits(DemoApp, Application);

module.exports = DemoApp;