'use strict';
const express = require('express')();
const fastify = require('fastify')({ logger: false });
const http = require('node:http');

const PORT = {
    EXPRESS: 8000,
    FASTIFY: 8001,
    HTTP: 8002
};

//express server
express.get('/', async (req, res) => {
    res.json({ hello: 'world' });
}).listen(PORT.EXPRESS);
fastify.get('/', options, async (request, reply) => {
    reply.send({ hello: 'world' });
});

//fastify options
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
//fastify server
fastify.listen({ port: PORT.FASTIFY });

//http server
http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ hello: 'world' }));
}).listen(PORT.HTTP);

console.log(`Listening on port ${PORT}...`);
