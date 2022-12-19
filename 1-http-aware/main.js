'use strict';
const express = require('express');
const bodyParser = require('body-parser');
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
    console.log(`${req.socket.remoteAddress} /GET user`);
    pool.query('SELECT * FROM users', (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows);
    });
});

app.post('/user', (req, res) => {
    const { login, password } = req.body;
    const user = JSON.stringify({ login, password });
    console.log(`${req.socket.remoteAddress} /POST user ${user}`);
    const sql = 'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id';
    pool.query(sql, [login, password], (err, data) => {
        if (err) throw err;
        res.status(201).json({ created: data.rows });
    });
});

app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`${req.socket.remoteAddress} /GET user/${id}`);
    const sql = 'SELECT * FROM users WHERE id = $1';
    pool.query(sql, [id], (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows);
    });
});

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});
