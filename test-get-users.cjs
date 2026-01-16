const https = require('https');

const options = {
    hostname: 'great-ideas-backend.onrender.com',
    port: 443,
    path: '/api/users',
    method: 'GET'
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
