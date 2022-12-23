'use strict';
const http = require('node:http');
const db = require('./db');
const bodyParser = require('./body');

const PORT = 8000;

const routing = {
    user: require('./user'),
    country: db('country'),
    city: db('city'),
};

const crud = {
    get: 'read',
    post: 'create',
    put: 'update',
    delete: 'delete'
};

http.createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return res.end('Not found');
    const procedure = crud[method.toLowerCase()];
    const handler = entity[procedure];
    if (!handler) return res.end('Not found');

    const args = {
        id,
        ... await bodyParser(req)
    };
    console.log(`${socket.remoteAddress} ${method} ${url}`);
    const result = await handler(args);
    res.writeHead(200, {
        'content-type': 'application/json'
    })
    res.end(JSON.stringify(result.rows, null, '\t'));
}).listen(PORT);


console.log(`Listening on port ${PORT}...`);
