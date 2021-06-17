const pool = require("../utils/pool");

module.exports = class Song {
    id;
    title;
    vidId;
    thumbnail;
    channelName;
    channelId;
    viewCount;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.vidId = row.vid_id;
        this.thumbnail = row.thumbnail;
        this.channelName = row.channel_name;
        this.channelId = row.channel_id;
        this.viewCount = row.view_count;
    }

    static async insert({
        title,
        vidId,
        thumbnail,
        channelName,
        channelId,
        viewCount,
    }) {
        const { rows } = await pool.query(
            `INSERT INTO songs (title, vid_id, thumbnail, channel_name, channel_id, view_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, vidId, thumbnail, channelName, channelId, viewCount]
        );

        return new Song(rows[0]);
    }

    static async insertAll(songs) {
        return await Promise.all(
            songs.map(async (song) => {
                const { rows } = await pool.query(
                    `INSERT INTO songs (title, vid_id, thumbnail, channel_name, channel_id, view_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                    [
                        song.title,
                        song.vidId,
                        song.thumbnail,
                        song.channelName,
                        song.channelId,
                        song.viewCount,
                    ]
                );

                return new Song(rows[0]);
            })
        );
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
