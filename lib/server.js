var acquires = {};
var Responder = require('cote').Responder;

var autoReleaseTimeout = 60000;
var autoReleaseTimer = null;

var counts = {
    acquires: 0,
    releases: 0
};

var lastCountLog = '';
var lastQueueLog = '';

function acquire(req, cb) {
    console.log(new Date, 'acquire requested', req.id);
    counts.acquires++;

    if (acquires[req.id]) {
        return acquires[req.id].push(cb);
    }

    acquires[req.id] = [];
    didAcquire(req, cb);
}

function release(req) {
    console.log(new Date, 'release', req.id);
    counts.releases++;
    clearTimeout(acquires[req.id].autoReleaseTimer);

    if (!(req.id in acquires)) return;

    if (!acquires[req.id].length)
        return delete acquires[req.id];

    var cb = acquires[req.id].shift();

    didAcquire(req, cb);
}

function didAcquire(req, cb) {
    console.log(new Date, 'acquire granted  ', req.id);

    cb();

    acquires[req.id].autoReleaseTimer = setTimeout(function() {
        console.log(new Date, 'auto release', req.id);
        release(req);
    }, autoReleaseTimeout);
}

function init() {
    var server = new Responder({
        name: 'semaver server',
        key: 'semaver',
        respondsTo: ['acquire', 'release']
    });

    server.on('acquire', acquire);

    server.on('release', release);

    setInterval(function() {
        var queueLog = '',
            countLog = 'counts ' + JSON.stringify(counts);

        if (countLog != lastCountLog) {
            lastCountLog = countLog;
            console.log(new Date, lastCountLog);
        }

        if (Object.keys(acquires).length) {
            var queue = {};

            for (var i in acquires)
                queue[i] = acquires[i].length;

            queueLog = 'in queue ' + JSON.stringify(queue);
            if (queueLog != lastQueueLog) {
                lastQueueLog = queueLog;
                console.log(new Date, lastQueueLog);
            }
        }

    }, 1000);
}

module.exports = {
    init: init
};
