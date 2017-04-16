'use strict';

/**
 * Abstract factory kind of function,
 * This class will cache and return the filter requested.
 *
 * @class Filter
 */
class Filter {
    /**
     * This method will examine the cache of the filters and check if the requested filter is present.
     * If not it will try to load this filter, when found it is returned.
     * When there is an error and the filter rejects to load an error is thrown.
     *
     * @method get
     * @param {String} filter The name of the filter to get.
     * @returns {Object} The requested filter.
     */
    get(filter) {
        try {
            return new (require('./' + filter))();
        } catch(Error) {
            throw new Error('Filter ' + filter + ' does not exist');
        }
    }
}

module.exports = new Filter();