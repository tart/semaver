var client = require('../lib/client');
var id = process.argv[2];

client.connect();

client.lock(id, function() {
    console.log('obtained lock', id);

    setTimeout(function() {
        console.log('unlocking', id);
        client.unlock(id);
    }, 10000);
});
