var Application = require('../../index').Application;
var util        = require('util');

function HomeApp() {
    HomeApp.super_.call(this);

    this.setConfig({
        componentFolder: __dirname + '/components'
    });
};

util.inherits(HomeApp, Application);

module.exports = HomeApp;