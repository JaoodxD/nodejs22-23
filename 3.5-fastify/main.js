'use strict';
const fastify = require('fastify')({ logger: false });
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
fastify.get('/user', async (req, res) => {
    return (await routing.user.read({})).rows;
});
fastify.listen({ port: 8000 });

console.log(`Listening on port ${PORT}...`);
