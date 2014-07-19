var cache = {};

/**
 * Abstract factory kind of function,
 * This class will cache and return the filter requested.
 * 
 * @constructor
 */
function Filter() {
    this.getFilter = function(filter) {
        try {
            if(!cache[filter]) {
                var Obj = require('./' + filter);
                cache[filter] = new Obj();
            }

            return cache[filter];
        } catch(Error) {
            throw new RaddishError(500, 'Filter ' + filter + ' does not exist');
        }
    };
}

module.exports = new Filter();