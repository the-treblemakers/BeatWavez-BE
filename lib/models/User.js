const pool = require("../utils/pool");

module.exports = class User {
    id;
    username;

    constructor(row) {
        this.id = row.id;
        this.username = row.username;
    }

    static async insert({ username }) {
        const { rows } = await pool.query(
            `INSERT INTO users (username) VALUES ($1) RETURNING *`,
            [username]
        );

        return new User(rows[0]);
    }

    static async selectById(id) {
        const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [
            id,
        ]);

        return new User(rows[0]);
    }

    static async updateById(id, user) {
        const { rows } = await pool.query(
            `UPDATE users SET username=$1 WHERE id=$2 RETURNING *`,
            [user.username, id]
        );

        return new User(rows[0]);
    }

    static async deleteById(id) {
        const { rows } = await pool.query(
            `DELETE FROM users WHERE id=$1 RETURNING *`,
            [id]
        );

        return new User(rows[0]);
    }
};
