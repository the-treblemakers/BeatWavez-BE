const { Router } = require("express");
const VideoService = require("../services/VideoService");

module.exports = Router()
    .get("/songbook", async (req, res, next) => {
        try {
            const songs = await VideoService.mungeVidIds(req.body);
            res.send(songs);
        } catch (err) {
            next(err);
        }
    })

    .get("/search", async (req, res, next) => {
        try {
            const songs = await VideoService.loadYouTubeResults(req.body);
            res.send(songs);
        } catch (err) {
            next(err);
        }
    });
