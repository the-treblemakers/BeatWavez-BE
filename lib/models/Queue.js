const pool = require("../utils/pool");

module.exports = class Queue {
    id;
    roomId;
    songId;
    order;

    constructor(row) {
        this.id = row.id;
        this.roomId = row.room_id;
        this.songId = row.song_id;
        this.order = row.order;
    }

    static async insert({ roomId, songId, order }) {
        const { rows } = await pool.query(
            `INSERT INTO queues (room_id, song_id, order) VALUES ($1, $2, $3) RETURNING *`,
            [roomId, songId, order]
        );

        return new Queue(rows[0]);
    }

    static async selectAll() {
        const { rows } = await pool.query(`SELECT * FROM queues`);

        return rows.map((row) => new Queue(row));
    }

    static async selectById(id) {
        const { rows } = await pool.query(`SELECT * FROM queues WHERE id=$1`, [
            id,
        ]);

        return new Queue(rows[0]);
    }

    static async deleteById(id) {
        const { rows } = await pool.query(
            `DELETE FROM queues WHERE id=$1 RETURNING *`,
            [id]
        );

        return new Queue(rows[0]);
    }
};
