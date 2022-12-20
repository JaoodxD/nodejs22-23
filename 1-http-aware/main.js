'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const hash = require('./hash');
const { Pool } = require('pg');

const PORT = 8000;

const app = express();

const pool = new Pool({
    host: '127.0.0.1',
    port: '5432',
    database: 'example',
    user: 'marcus',
    password: 'marcus'
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/user', (req, res) => {
    console.log(`${req.socket.remoteAddress} GET /user`);
    pool.query('SELECT * FROM users', (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows);
    });
});

app.post('/user', async (req, res) => {
    const { login, password } = req.body;
    const user = JSON.stringify({ login, password });
    console.log(`${req.socket.remoteAddress} POST /user ${user}`);
    const sql = 'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id';
    const passwordHash = await hash(password);
    pool.query(sql, [login, passwordHash], (err, data) => {
        if (err) throw err;
        res.status(201).json({ created: data.rows });
    });
});

app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`${req.socket.remoteAddress} GET /user/${id}`);
    const sql = 'SELECT * FROM users WHERE id = $1';
    pool.query(sql, [id], (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows);
    });
});

app.put('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { login, password } = req.body;
    const user = JSON.stringify({ login, password });
    console.log(`${req.socket.remoteAddress} PUT /user/${id} ${user}`);
    const sql = 'UPDATE users SET login = $1, password = $2 WHERE id = $3 RETURNING id';
    const passwordHash = await hash(password);
    pool.query(sql, [login, passwordHash, id], (err, data) => {
        if (err) throw err;
        res.status(201).json({ modified: data.rows });
    });
});

app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`${req.socket.remoteAddress} DELETE /user/${id}`);
    const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
    pool.query(sql, [id], (err, data) => {
        if (err) throw err;
        res.status(200).json({ deleted: data.rows });
    });
});

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});
