const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/v1/results", require("./controllers/videos"));
app.use("/api/v1/songs", require("./controllers/songs"));
app.use("/api/v1/users", require("./controllers/users"));


app.use(require("./middleware/not-found"));
app.use(require("./middleware/error"));

module.exports = app;
