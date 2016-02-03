"use strict";

/**
 * The Threads class will scale the amount of processes when the load is higher.
 * This will be done completely automatic.
 *
 * And in the config file you can turn this on or off and set more data.
 * This must scale automatically.
 *
 * Also this class will be a little bit like cluster2.
 *
 * If a process activity is higher than 50% we will spawn a new process to lighten the tasks.
 */
var cluster = require('cluster'),
    usage   = require('usage'),
    threads = [],
    config = {
        maxThreads: 16,
        maxThreshold: 50,
        minThreshold: 10,
        interval: 500
    },
    master = undefined;

/**
 * This object is automatically started when thread support is enabled.
 *
 * @constructor
 */
function Threads() {
    var threadsConfig = Raddish.getConfig('threads');
    var isWin = /^win/.test(process.platform);

    if(threadsConfig !== false && !isWin) {
        if(cluster.isMaster) {
            console.log('Threads support enabled!');

            master = cluster;
            threads.push(cluster.fork());
        }

        if(threadsConfig.maxThreads) {
            config.maxThreads = threadsConfig.maxThreads;
        }

        if(threadsConfig.maxThreshold) {
            config.maxThreshold = threadsConfig.maxThreshold;
        }

        if(threadsConfig.minThreshold) {
            config.minThreshold = threadsConfig.minThreshold;
        }

        if(threadsConfig.interval) {
            config.interval = threadsConfig.interval
        }

        setInterval(this.checkThreads, config.interval);
    } else if(threadsConfig !== false && isWin) {
        console.log('Threads not supported in Windows');
    }
}

Threads.prototype.checkThreads = function() {
    new Promise(function(resolve, reject) {
        var mean        = 0;
        var total       = threads.length;
        var collection  = [];

        for(var index in threads) {
            if(threads.hasOwnProperty(index)) {
                var thread = threads[index];

                var promise = new Promise(function (resolve, reject) {
                    usage.lookup(thread.process.pid, function (err, result) {
                        if (err) {
                            return reject(err);
                        }

                        mean += result.cpu;
                        return resolve();
                    });
                });

                collection.push(promise);
            }
        }

        return Promise.all(collection);
    }).then(function() {
        if((mean / total) > config.maxThreshold && total < config.maxThreads) {
            console.log('Spawning new process!');
            threads.push(master.fork());
        } else if((mean / total) < config.minThreshold && total > 1) {
            var thread = threads.pop();

            console.log('Killing process!');
            thread.kill();
        }
    });
};

module.exports = new Threads();