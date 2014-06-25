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

        return mongo.connectAsync('mongodb://' + auth + config.host + ':' + config.port)
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
                return result.toArrayAsync();
            } else {
                return result;
            }
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
    var collection = Promise.promisifyAll(this.connection.collection(name));

    return collection.findAsync()
        .then(function(rows) {
            rows = Promise.promisifyAll(rows);

            return rows.toArrayAsync();
        })
        .then(function(rows) {
            var columns = [];

            for(var index in rows) {
                var row = rows[index];

                for(var key in row) {
                    if(columns.indexOf(key) == -1) {
                        columns.push(key);
                    }
                }
            }

            return columns;
        });
};

module.exports = MongoAdapter;