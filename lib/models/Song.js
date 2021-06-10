const pool = require("../utils/pool");

module.exports = class Song {
    id;
    title;
    vid_id;
    thumbnail;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.vidId = row.vid_id;
        this.thumbnail = row.thumbnail;
    }

    static async insert({ title, vidId, thumbnail }) {
        const { rows } = await pool.query(
            `INSERT INTO songs (title, vid_id, thumbnail) VALUES ($1, $2, $3) RETURNING *`,
            [title, vidId, thumbnail]
        );

        return new Song(rows[0]);
    }

    static async selectAll() {
        const { rows } = await pool.query(`SELECT * FROM songs`);

        return rows.map((row) => new Song(row));
    }

    static async selectById(id) {
        const { rows } = await pool.query(`SELECT * FROM songs WHERE id=$1`, [
            id,
        ]);

        return new Song(rows[0]);
    }

    static async deleteById(id) {
        const { rows } = await pool.query(
            `DELETE FROM songs WHERE id=$1 RETURNING *`,
            [id]
        );

        return new Song(rows[0]);
    }
};
