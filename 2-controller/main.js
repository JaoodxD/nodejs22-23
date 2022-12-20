'use strict';
const http = require('node:http');

const hash = require('./hash');
const bodyParser = require('./body');
const { Pool } = require('pg');

const PORT = 8000;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus'
});

const routing = {
    user: {
        get: async ({ id }) => {
            if (!id) return pool.query('SELECT id, login FROM users');
            const sql = 'SELECT id, login FROM users WHERE id = $1';
            return pool.query(sql, [id]);
        },
        post: async ({ login, password }) => {
            const sql = 'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id';
            const passwordHash = await hash(password);
            return pool.query(sql, [login, passwordHash]);
        },
        put: async ({ id, login, password }) => {
            const sql = 'UPDATE users SET login = $1, password = $2 WHERE id = $3 RETURNING id';
            const passwordHash = await hash(password);
            return pool.query(sql, [login, passwordHash, id]);
        },
        delete: async ({ id }) => {
            const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
            return pool.query(sql, [id]);
        },
    },
};

http.createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return res.end('Not found');
    const handler = entity[method.toLowerCase()];
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
    res.end(JSON.stringify(result.rows));
}).listen(PORT);

console.log(`Listening on port ${PORT}...`);
