const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", (request, response) => {
    db.query("SELECT * FROM topics;").then(({ rows }) => {
        response.status(200).send({ topics: rows });
    });
});

module.exports = app;
