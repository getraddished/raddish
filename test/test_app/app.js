var Application = require('../../index').Application;

class TestApplication extends Application {
    constructor() {
        super({
            component: __dirname + '/components',
            config: __dirname + '/config'
        });

        this._alias = 'demo';
    }
}

module.exports = TestApplication;