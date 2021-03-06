const pool = require("../utils/pool");

module.exports = class Room {
    id;
    roomName;
    host;
    passcode;

    constructor(row) {
        this.id = row.id;
        this.roomName = row.room_name;
        this.host = row.host;
        this.passcode = row.passcode;
    }

    static async insert({ roomName, host }) {
        const { rows } = await pool.query(
            `INSERT INTO rooms (room_name, host, passcode) VALUES ($1, $2, $3) RETURNING *`,
            [roomName, host, passcode]
        );

        return new Room(rows[0]);
    }

    static async selectAll() {
        const { rows } = await pool.query(`SELECT * FROM rooms`);

        return rows.map((row) => new Room(row));
    }

    static async selectById(id) {
        const { rows } = await pool.query(`SELECT * FROM rooms WHERE id=$1`, [
            id,
        ]);

        return new Room(rows[0]);
    }

    static async deleteById(id) {
        const { rows } = await pool.query(
            `DELETE FROM rooms WHERE id=$1 RETURNING *`,
            [id]
        );

        return new Room(rows[0]);
    }
};
