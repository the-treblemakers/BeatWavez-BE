const pool = require("../utils/pool");

module.exports = class Song {
    id;
    title;
    vidId;
    thumbnail;
    channelName;
    channelId;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.vidId = row.vid_id;
        this.thumbnail = row.thumbnail;
        this.channelName = row.channel_name;
        this.channelId = row.channel_id;
    }

    static async insert({ title, vidId, thumbnail, channelName, channelId }) {
        const { rows } = await pool.query(
            `INSERT INTO songs (title, vid_id, thumbnail, channel_name, channel_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, vidId, thumbnail, channelName, channelId]
        );

        console.log(rows[0], 'SINGLE UPLOAD');
        return new Song(rows[0]);
    }

    static async insertAll(songs) {
        return await Promise.all(songs.map(async (song, i) => {
            const { rows } = await pool.query(
                `INSERT INTO songs (title, vid_id, thumbnail, channel_name, channel_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [song.title, song.vidId, song.thumbnail, song.channelName, song.channelId]
            );

            return new Song(rows[0]);
        }));
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
