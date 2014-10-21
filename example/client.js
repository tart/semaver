var client = require('../lib/client');
var key = process.argv[2] || 'semaver example';
var id = process.argv[3] || 1;

client.connect(key, function() {
    client.acquire(id, function() {
        console.log('obtained lock', id);

        setTimeout(function() {
            console.log('unlocking', id);
            client.release(id);
        }, 10000);
    });
});

