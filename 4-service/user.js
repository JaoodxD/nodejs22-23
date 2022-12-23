'use strict';

const hash = require('./hash');
const db = require('./db');

const users = db('users', ['id', 'login']);

module.exports = ({
    ...users,

    async create({ login, password }) {
        const hashedPassword = await hash(password);
        return users.create({ login, password: hashedPassword });
    },

    async update({ id, login, password }) {
        const hashedPassword = await hash(password);
        return users.update({ id, login, password });
    }

});
