const hash = require(`./hash`);
const { Pool } = require(`pg`);

const pool = new Pool({
    host: `127.0.0.1`,
    port: 5432,
    database: `example`,
    user: `marcus`,
    password: `marcus`
});

module.exports = (table, permittedFields = ['*']) => ({
    query: async (sql, args) => {
        return pool.query(sql, args);
    },

    read: async ({ id, fields = permittedFields }) => {
        const names = fields.join(', ');
        if (!id) return pool.query(`SELECT ${names} FROM ${table}`);
        const sql = `SELECT ${names} FROM ${table} WHERE id = $1`;
        return pool.query(sql, [id]);
    },

    create: async ({ id, ...fields }) => {
        const keys = Object.keys(fields)
            .map((field) => `"${field}"`)
            .join(', ');
        const values = Object.keys(fields)
            .map((_, i) => `$${i + 1}`)
            .join(', ');
        const data = Object.values(fields);
        const sql = `INSERT INTO ${table} (${keys}) VALUES (${values}) RETURNING id`;
        return pool.query(sql, data);
    },

    update: async ({ id, ...fields }) => {
        let i = 1;
        const delta = Object.keys(fields)
            .map((key) => (`"${key}" = $${i++}`))
            .join(', ');
        const sql = `UPDATE ${table} SET ${delta} WHERE id = $${i} RETURNING id`;
        const data = [...Object.values(fields), id];
        return pool.query(sql, data);
    },

    delete: async ({ id }) => {
        const sql = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
        return pool.query(sql, [id]);
    },
});
