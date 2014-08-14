function ConsoleAdapter(options) {
    this.codes = {
        404: 'info',
        500: 'error'
    };
}

ConsoleAdapter.prototype.log = function(code, message) {
    var method = this.codes[code] ? this.codes[code] : 'log';
    
    console[method](message);
};

module.exports = ConsoleAdapter;