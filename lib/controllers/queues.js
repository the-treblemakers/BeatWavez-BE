const { Router } = require("express");
const Queue = require("../models/Queue");

module.exports = Router()
    .post("/", async (req, res, next) => {
        try {
            const queue = await Queue.insert(req.body);
            res.send(queue);
        } catch (err) {
            next(err);
        }
    })

    .get("/", async (req, res, next) => {
        try {
            const queues = await Queue.selectAll();
            res.send(queues);
        } catch (err) {
            next(err);
        }
    })

    .get("/:id", async (req, res, next) => {
        try {
            const queue = await Queue.selectById(req.params.id);
            res.send(queue);
        } catch (err) {
            next(err);
        }
    })

    .delete("/:id", async (req, res, next) => {
        try {
            const queue = await Queue.deleteById(req.params.id);
            res.send(queue);
        } catch (err) {
            next(err);
        }
    });
