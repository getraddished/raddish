var fs = require('fs');

function FileAdapter(config) {
    this.file = fs.openSync(process.cwd() + config.file, 'a+');
}

FileAdapter.prototype.log = function() {
    
};

module.exports = FileAdapter;