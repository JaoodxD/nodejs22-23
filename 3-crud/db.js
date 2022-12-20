const hash = require(`./hash`);
const { Pool } = require(`pg`);

const pool = new Pool({
    host: `127.0.0.1`,
    port: 5432,
    database: `example`,
    user: `marcus`,
    password: `marcus`
});

module.exports = (table) => ({
    get: async ({ id }) => {
        if (!id) return pool.query(`SELECT id, login FROM ${table}`);
        const sql = `SELECT id, login FROM ${table} WHERE id = $1`;
        return pool.query(sql, [id]);
    },
    post: async ({ login, password }) => {
        const sql = `INSERT INTO ${table} (login, password) VALUES ($1, $2) RETURNING id`;
        const passwordHash = await hash(password);
        return pool.query(sql, [login, passwordHash]);
    },
    put: async ({ id, login, password }) => {
        const sql = `UPDATE ${table} SET login = $1, password = $2 WHERE id = $3 RETURNING id`;
        const passwordHash = await hash(password);
        return pool.query(sql, [login, passwordHash, id]);
    },
    delete: async ({ id }) => {
        const sql = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
        return pool.query(sql, [id]);
    },
});
