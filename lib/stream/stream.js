var util        = require('util'),
    Stream      = require('stream');

function RaddishStream() {
    this.stream = {};
}

RaddishStream.prototype.setSource = function(stream) {
    if(stream instanceof RaddishStream) {
        stream = stream.stream;
    }

    this.stream = stream;

    return this;
};

RaddishStream.prototype.pipe = function(destination) {
    this.stream.pipe(destination);

    return this;
};

RaddishStream.prototype.transform = function(transform, flush, objectMode) {
    if(typeof flush != 'function' && !objectMode) {
        objectMode = flush;
        flush = false;
    }

    var dest = new Stream.Transform({objectMode: objectMode});
    dest._transform = transform;

    if(flush) {
        dest._flush = flush;
    }

    this.stream = this.stream.pipe(dest);

    return this;
};

RaddishStream.prototype.cast = function(object) {
    var stream = new Stream.Readable({objectMode: true});

    if(util.isArray(object)) {
        stream._read = function() {
            for(var key in object) {
                this.push(object[key]);
            }

            this.push(null);
        };
    } else {
        stream._read = function() {
            this.push(object);
            this.push(null);
        }
    }

    this.stream = stream;

    return this;
};

RaddishStream.prototype.promise = function() {
    var data,
        self = this;

    return new Promise(function(resolve, reject) {
        self.stream.on('data', function(chunk) {
            if(typeof chunk == 'object') {
                if(data == undefined) {
                    data = [];
                }

                data.push(chunk);
            } else if(typeof chunk == 'string') {
                if(data == undefined) {
                    data = '';
                }

                data += chunk;
            }
        });

        self.stream.on('end', function() {
            resolve(data);
        });

        self.stream.on('error', function(error) {
            throw new RaddishError(500, error.message);
        });
    })
};

module.exports = RaddishStream;