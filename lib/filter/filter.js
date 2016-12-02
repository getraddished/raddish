var cache = {};

/**
 * Abstract factory kind of function,
 * This class will cache and return the filter requested.
 *
 * @constructor
 */
class Filter {
    /**
     * This method will examine the cache of the filters and check if the requested filter is present.
     * If not it will try to load this filter, when found it is added to the cache and returned.
     * When there is an error and the filter rejects to load an error is returned.
     *
     * @method getFilter
     * @param {String} filter The name of the filter to get.
     * @returns {Object} The requested filter.
     */
    getFilter(filter) {
        try {
            if(!cache[filter]) {
                var Obj = require('./' + filter);
                cache[filter] = new Obj();
            }

            return cache[filter];
        } catch(Error) {
            throw new RaddishError(500, 'Filter ' + filter + ' does not exist');
        }
    }
}

module.exports = new Filter();