const { Router } = require("express");
const Room = require("../models/Room");

module.exports = Router()
    .post("/", async (req, res, next) => {
        try {
            const room = await Room.insert(req.body);
            res.send(room);
        } catch (err) {
            next(err);
        }
    })

    .get("/", async (req, res, next) => {
        try {
            const rooms = await Room.selectAll();
            res.send(rooms);
        } catch (err) {
            next(err);
        }
    })

    .get("/:id", async (req, res, next) => {
        try {
            const room = await Room.selectById(req.params.id);
            res.send(room);
        } catch (err) {
            next(err);
        }
    })

    .delete("/:id", async (req, res, next) => {
        try {
            const room = await Room.deleteById(req.params.id);
            res.send(room);
        } catch (err) {
            next(err);
        }
    });
