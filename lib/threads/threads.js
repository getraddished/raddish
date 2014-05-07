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
var cluster = require('cluster');
var usage   = require('usage');
var threads = [];
var config = {
    maxThreads: 16,
    maxThreshold: 50,
    minThreshold: 10,
    interval: 500
}
var master = undefined;
var async = require('async');

function Threads() {
    var threadsConfig = Raddish.getConfig('threads');

    if(threadsConfig !== false) {
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
    }
};

Threads.prototype.checkThreads = function() {
    // We will hold our own threads.
    var mean    = 0;
    var total   = threads.length;

    async.each(threads, function(item, next) {
        usage.lookup(item.process.pid, function(err, result) {
            mean += result.cpu;
            next();
        });
    }, function() {
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