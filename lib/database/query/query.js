module.exports = {
    getType: function(type) {
        try {
            var Obj = require('./' + type + '/' + type);

            return new Obj();
        } catch(error) {
            throw new Error('This type isn\'t supported yet.');
        }
    }
};