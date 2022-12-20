'use strict';
const http = require('node:http');
const fastify = require('fastify')({ logger: false });
const express = require('express')();
const db = require('./db');
const bodyParser = require('./body');

const PORT = {
    EXPRESS: 8000,
    FASTIFY: 8001,
    HTTP: 8002
};

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
fastify.listen({ port: PORT.FASTIFY });

http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ hello: 'world' }));
}).listen(PORT.HTTP);

express.get('/', async (req, res) => {
    res.json({ hello: 'world' });
}).listen(PORT.EXPRESS);
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
