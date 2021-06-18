const { Router } = require("express");
const Song = require("../models/Song");

module.exports = Router()
    .post("/", async (req, res, next) => {
        try {
            const song = await Song.insert(req.body);
            res.send(song);
        } catch (err) {
            next(err);
        }
    })

    .post("/all", async (req, res, next) => {
        try {
            const songs = await Song.insertAll(req.body);
            res.send(songs);
        } catch (err) {
            next(err);
        }
    })

    .get("/", async (req, res, next) => {
        try {
            const songs = await Song.selectAll();
            res.send(songs);
        } catch (err) {
            next(err);
        }
    })

    .get("/:id", async (req, res, next) => {
        try {
            const song = await Song.selectById(req.params.id);
            res.send(song);
        } catch (err) {
            next(err);
        }
    })

    .delete("/:id", async (req, res, next) => {
        try {
            const song = await Song.deleteById(req.params.id);
            res.send(song);
        } catch (err) {
            next(err);
        }
    });
