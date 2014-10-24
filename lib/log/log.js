function Log(code, message) {
    var logging     = Raddish.getConfig('logging');
    var identifier  = ((logging && logging.adapter) ? logging.adapter.indexOf(':') > -1 : false) ? logging.adapter : 'core:log.adapter.' + (logging.adapter ? logging.adapter : 'console');

    this.adapter    = this.getAdapter(identifier, logging.options);
    this.adapter.log(code, message);
}

Log.prototype.getAdapter = function(adapter, options) {
    if(typeof this.adapter === 'object') {
        return this.adapter;
    } else {
        var Object = {};

        try {
            Object = ObjectLoader.require(adapter);
            if(Object === false) {
                throw new Error('Adapter identifier "' + adapter + '" is faulty!');
            }
            return new Object(options);
        } catch(error) {
            // When an error is thrown show it in the console.
            console.log(error);

            // Then fallback to console.
            Object = require('./adapter/console');
            return new Object(options);
        }
    }
};

module.exports = Log;