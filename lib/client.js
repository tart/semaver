var Requester = require('cote').Requester;
var client;

function connect(key, done) {
    if (!key)
        throw new Error('Error: You should provide a key as the second parameter to connect function.');

    client = new Requester({
        name: 'semaver client: ' + key,
        key: key,
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
