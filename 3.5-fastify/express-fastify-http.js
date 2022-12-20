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

console.log(`Listening on port ${PORT}...`);
