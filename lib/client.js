var Requester = require('cote').Requester;
var client;

function connect(done) {
    client = new Requester({
        name: 'semaver client',
        key: 'semaver',
        requests: ['acquire', 'release']
    });

    client.on('ready', function() {
        done();
    });
}

function acquire(id, cb) {
    client.send({ type: 'acquire', id: id }, cb);
}

function release(id) {
    client.send({ type: 'release', id: id });
}

module.exports = {
    connect: connect,
    acquire: acquire,
    release: release
};
