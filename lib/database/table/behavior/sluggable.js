var Abstract    = require('../../../command/behavior/behavior');
var util        = require('util');
var Filter      = require('../../../filter/filter');

/**
 * The sluggable bahavior will automatically add the slug.
 * The slug to be created will be based on the column config value, if none is given the default will be the title column
 *
 * @constructor
 */
function SluggableBehavior(config) {
    Abstract.call(this, config);
}

util.inherits(SluggableBehavior, Abstract);

SluggableBehavior.prototype.initialize = function(config) {
    if(!config.column) {
        config.column = 'title';
    }

    return Abstract.prototype.initialize.call(this, config);
};

SluggableBehavior.prototype.onBeforeInsert = function(context) {
    return this.onBeforeUpdate(context);
};

SluggableBehavior.prototype.onBeforeUpdate = function(context) {
    var self    = this;
    var query   = {};
    var filter  = Filter.getFilter('slug');
    var table   = context.data.getTable();

    if(context.data.data[this.config.column] && Object.keys(context.data.data).indexOf('slug') > -1) {
        var slug = Filter.getFilter('slug').sanitize(context.data.data[this.config.column]);

        return context.data.getTable()
            .then(function(table) {
                return [table, table.getQuery()];
            })
            .spread(function(table, query) {
                var select_query = query.select();
                select_query.table(table.getName()).where('slug', 'LIKE', slug);

                return [table.select(select_query, 2, true), table, query];
            })
            .spread(function(data, table, query) {
                if(Raddish.getConfig('stream')) {
                    return new Promise(function(resolve, reject) {
                        var dat = {};
                        dat.rows = [];

                        data.on('data', function(data) {
                            console.log()
                            dat.rows.push(data);
                        });

                        data.on('end', function() {
                            resolve([dat, table, query]);
                        });
                    });
                }

                return [data, table, query];
            })
            .spread(function(data, table, query) {
                if(data.rows.length === 0) {
                    context.data.data.slug = slug;

                    return context;
                } else {
                    return self.createSlug(context, table, query, slug);
                }
            });
    } else {
        return Promise.resolve(context);
    }
};

SluggableBehavior.prototype.createSlug = function(context, table, query, slug) {
    var select_query = query.select();
    select_query.table(table.getName()).where('slug', 'LIKE', slug + '-%');

    return table.select(select_query, 2)
        .then(function(data) {
            var slugs = [];
            var i = 1;

            for(var index in data.rows) {
                slugs.push(data.rows[index].data.slug);
            }

            while(slugs.indexOf(slug + '-' + i) > -1) {
                i++;
            }

            context.data.data.slug = slug + '-' + i;

            return context;
        });
};

module.exports = SluggableBehavior;