var Abstract    = require('./abstract');
var util        = require('util');
var query       = require('../query/query');
var mongo       = Promise.promisifyAll(require('mongodb').MongoClient);
var instances   = {};

function MongoAdapter(config, connection) {
    MongoAdapter.super_.call(this, config);

    this.connection = connection;
    this.strictColumns = false;

    this.types = {

    };

    this.queryBuilder = query.getType('mongo');
};

util.inherits(MongoAdapter, Abstract);

MongoAdapter.prototype.getInstance = function(name, config) {
    var auth = '';
    var self = this;

    if(instances[name]) {
        return Promise.resolve(instances[name]);
    } else {
        // We will create our auth string.
        if(config.user && config.password) {
            auth = config.user + ':' + config.password + '@';
        }

        return mongo.connectAsync('mongodb://' + auth + config.host + ':' + (config.port || 27017) + '/' + config.database)
            .then(function(connection) {
                instances[name] = new MongoAdapter({
                    identifier: self.getIdentifier()
                }, connection);

                return instances[name];
            });

    }
};

MongoAdapter.prototype.execute = function(query) {
    // select the collection.
    var collection = Promise.promisifyAll(this.connection.collection(query.getTable()));

    // Function
    var method = query.getMethod() + 'Async';

    return collection[method](query.toQuery())
        .then(function(result) {
            result = Promise.promisifyAll(result);

            if(typeof result.toArrayAsync == 'function') {
                if(query.getLimit() > 0) {
                    result.limit(query.getLimit());

                    if(query.getOffset()) {
                        result.skip(query.getOffset());
                    }
                }

                return result.toArrayAsync();
            } else {
                return result;
            }
        })
        .catch(function(error) {
            throw new RaddishError(500, error.message);
        });

};

MongoAdapter.prototype.getSchema = function(name) {
    var result = {};
    var self = this;

    return this._fetchInfo(name)
        .then(function(info) {
            result.info = info;

            return self._fetchIndexes(name);
        })
        .then(function(indexes) {
            result.indexes = indexes;

            return self._fetchColumns(name);
        })
        .then(function(columns) {
            result.columns = columns;

            return result;
        });
};

MongoAdapter.prototype._fetchInfo = function(name) {
    return Promise.resolve({
        name: name
    });
};

MongoAdapter.prototype._fetchIndexes = function(name) {
    var collection = Promise.promisifyAll(this.connection.collection(name));

    return collection.indexesAsync()
        .then(function(indexes) {
            if(indexes.length <= 0) {
                return [
                    '_id'
                ];
            } else {
                return indexes;
            }
        });
};

MongoAdapter.prototype._fetchColumns = function(name) {
    var collection  = Promise.promisifyAll(this.connection.collection(name));
    var self        =  this;

    return collection.findAsync()
        .then(function(rows) {
            rows = Promise.promisifyAll(rows);

            return rows.toArrayAsync();
        })
        .then(function(rows) {
            var columns = {};

            // Always add _id
            columns['_id'] = {
                name: '_id',
                unique: true,
                autoinc: true,
                value: null,
                type: 'mongo-id',
                filter: self.getFilter('mongo-id')
            };

            for(var index in rows) {
                var row = rows[index];

                for(var key in row) {
                    var type = getType(row[key]);
                    if(!columns[key]) {
                        columns[key] = {
                            name: key,
                            unique: false,
                            autoinc: false,
                            value: null,
                            type: type,
                            filter: self.getFilter(type)
                        };
                    }
                }
            }

            return columns;
        });
};

// This idea is good, now i have to fine-tune it.
function getType(item) {
    if (Object.prototype.toString.call(item) === "[object Number]") {
        return "number";

    } else if (Object.prototype.toString.call(item) === "[object String]") {
        return "string";

    } else if (Object.prototype.toString.call(item) === "[object Date]") {
        return "date";

    } else if(Object.prototype.toString.call(item) === '[object Array]' ) {
        return "array";

    } else if(typeof(item)=="object") {
        for(var index in item) {
            return index[index];
        }

    } else{
        return (typeof item)[0].toUpperCase() + (typeof item).slice(1);

    }
}

module.exports = MongoAdapter;