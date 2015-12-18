"use strict";

var util        = require('util'),
    Stream      = require('stream');

/**
 * This object is a wrapper around streams and promises,
 * this makes it easy to cast a value to a Stream and cast a stream to a promise.
 *
 * Also it adds a convenient transform method.
 *
 * @class RaddishStream
 * @constructor
 */
function RaddishStream() {
    this.stream = {};
}

/**
 * This method adds a stream as its source.
 * If the source is a RaddishStream its containing stream will be used.
 *
 * @method setSource
 * @param {*} stream The stream to use as the source.
 * @returns {RaddishStream} The RaddishStream object itself.
 */
RaddishStream.prototype.setSource = function(stream) {
    if(stream instanceof RaddishStream) {
        stream = stream.stream;
    }

    this.stream = stream;

    return this;
};

/**
 * This method is a proxy for the pipe method,
 * this will bind its destination to the contained stream.
 *
 * @method pipe
 * @param {Object} destination The destination stream to pipe to.
 * @returns {RaddishStream} The RaddishStream object used for chaining.
 */
RaddishStream.prototype.pipe = function(destination) {
    this.stream.pipe(destination);

    return this;
};

/**
 * The transform method is a convenient wrapper for a transformation.
 *
 * @method transform
 * @param {Function} transform The function which to execute on each chunk for its transformation.
 * @param {Function} flush The last chunk to send after all the transformations.
 * @param {Boolean} objectMode To force objectMode.
 * @returns {RaddishStream} The RaddishStream object itself used for chaining.
 */
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

/**
 * The cast method will cast any value to a Stream,
 * after this a RaddishStream object will be returned.
 *
 * @method cast
 * @param {*} object The value to be cast to a stream.
 * @returns {RaddishStream} The RaddishStream object used for chaining.
 */
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

/**
 * This method is a proxy between the RaddishStream object and it containing stream.
 * This method therefor works the same as any other .on method.
 *
 * @method on
 * @param {String} event The event which to listen to.
 * @param {Function} action The action to do in the event.
 * @returns {RaddishStream} The RaddishStream object used for chaining.
 */
RaddishStream.prototype.on = function(event, action) {
    this.stream.on(event, action);

    return this;
}

/**
 * This method converts the stream to a promise.
 *
 * @method promise
 * @returns {Promise} The resolved or rejected promise.
 */
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