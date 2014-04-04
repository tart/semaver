var acquires = {};
var Responder = require('cote').Responder;

var counts = {
    acquires: 0,
    releases: 0
};

function init() {
    var server = new Responder({
        name: 'semaver server',
        key: 'semaver',
        respondsTo: ['acquire', 'release']
    });

    server.on('acquire', function(req, cb) {
        console.log('acquire', req.id);
        counts.acquires++;

        if (acquires[req.id])
            return acquires[req.id].push(cb);

        acquires[req.id] = [];
        cb();
    });

    server.on('release', function(req) {
        console.log('release', req.id);
        counts.releases++;

        if (!(req.id in acquires)) return;

        if (!acquires[req.id].length)
            return delete acquires[req.id];

        var cb = acquires[req.id].shift();
        cb && cb();
    });

    setInterval(function() {
        console.log('counts', counts);

        if (Object.keys(acquires).length)
            console.log(acquires);
    }, 1000);
}

module.exports = {
    init: init
};
