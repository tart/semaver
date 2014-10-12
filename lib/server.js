var acquires = {};
var Responder = require('cote').Responder;

var autoReleaseTimeout = 60000;
var autoReleaseTimer = null;

var counts = {
    acquires: 0,
    releases: 0
};

function acquire(req, cb) {
    console.log('acquire requested', req.id);
    counts.acquires++;

    if (acquires[req.id]) {
        return acquires[req.id].push(cb);
    }

    acquires[req.id] = [];
    didAcquire(req, cb);
}

function release(req) {
    console.log('release', req.id);
    counts.releases++;

    if (!(req.id in acquires)) return;

    if (!acquires[req.id].length)
        return delete acquires[req.id];

    var cb = acquires[req.id].shift();

    didAcquire(req, cb);
}

function didAcquire(req, cb) {
    console.log('acquire granted', req.id);

    cb();

    clearTimeout(autoReleaseTimer);
    autoReleaseTimer = setTimeout(function() {
        console.log('auto release', req.id);
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
        console.log('counts', counts);

        if (Object.keys(acquires).length)
            console.log(acquires);
    }, 1000);
}

module.exports = {
    init: init
};
