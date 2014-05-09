var client = require('../lib/client');
var id = process.argv[2];

client.connect(function() {
    client.acquire(id, function() {
        console.log('obtained lock', id);

        setTimeout(function() {
            console.log('unlocking', id);
            client.release(id);
        }, 10000);
    });
});

