const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router.js");
const cors = require("cors");

app.use(cors());

app.use("/", express.static("public"));

app.use(express.json());

app.use("/api", apiRouter);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else {
        console.error(err);
        response.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = app;
