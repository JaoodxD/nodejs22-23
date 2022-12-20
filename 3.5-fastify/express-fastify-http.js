'use strict';
const http = require('node:http');
const fastify = require('fastify')({ logger: false });
const express = require('express')();
const db = require('./db');
const bodyParser = require('./body');

const PORT = 8000;

const routing = {
    user: db('users', ['id', 'login']),
};

const crud = {
    get: 'read',
    post: 'create',
    put: 'update',
    delete: 'delete'
};
// fastify.get('/user', async (req, res) => {
//     return (await routing.user.read({})).rows;
// });
const options = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
fastify.get('/', options, async (request, reply) => {
    reply.send({ hello: 'world' });
});
fastify.listen({ port: 8000 });

http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ hello: 'world' }));
}).listen(8001);

express.get('/', async (req, res) => {
    res.json({ hello: 'world' });
}).listen(8002);
/* http.createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return res.end('Not found1');
    const procedure = crud[method.toLowerCase()];
    const handler = entity[procedure];
    // console.log({ method, procedure, handler });
    if (!handler) return res.end('Not found');

    const args = {
        id,
        ... await bodyParser(req)
    };
    // console.log(`${socket.remoteAddress} ${method} ${url}`);
    const result = await handler(args);
    res.writeHead(200, {
        'content-type': 'application/json'
    })
    res.end(JSON.stringify(result.rows));
}).listen(PORT); */

console.log(`Listening on port ${PORT}...`);
