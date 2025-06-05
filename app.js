const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

app.use(express.json());

const {
    getAllArticles,
    getArticleById,
    patchArticleVotes,
} = require("./controllers/articles.controller.js");

const {
    getCommentsByArticle,
    postCommentByArticle,
} = require("./controllers/comments.controller.js");

const { getAllTopics } = require("./controllers/topics.controller.js");

const { getAllUsers } = require("./controllers/users.controller.js");

app.get("/api", (request, response) => {
    return response.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        console.error(err);
        res.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = app;
