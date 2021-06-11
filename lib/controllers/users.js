const { Router } = require("express");
const User = require("../models/User");

module.exports = new Router()
    .post("/", async (req, res, next) => {
        try {
            const user = await User.insert(req.body);
            res.send(user);
        } catch (err) {
            next(err);
        }
    })

    .get("/:id", async (req, res, next) => {
        try {
            const user = await User.selectById(req.params.id);
            res.send(user);
        } catch (err) {
            next(err);
        }
    })

    .put("/:id", async (req, res, next) => {
        try {
            const user = await User.updateById(req.params.id, req.body);
            res.send(user);
        } catch (err) {
            next(err);
        }
    })

    .delete("/:id", async (req, res, next) => {
        try {
            const user = await User.deleteById(req.params.id);
            res.send(user);
        } catch (err) {
            next(err);
        }
    });
