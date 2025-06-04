const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
    return response.status(200).send({ endpoints });
});

app.get("/api/topics", (request, response) => {
    return db
        .query("SELECT slug, description FROM topics;")
        .then(({ rows }) => {
            response.status(200).send({ topics: rows });
        });
});

app.get("/api/articles", (request, response) => {
    return db
        .query(
            `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY 
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url
      ORDER BY articles.created_at DESC;`
        )
        .then(({ rows }) => {
            response.status(200).send({ articles: rows });
        });
});

app.get("/api/users", (request, response) => {
    return db
        .query(
            `SELECT 
            users.username,
            users.name,
            users.avatar_url
        FROM users`
        )
        .then(({ rows }) => {
            response.status(200).send({ users: rows });
        });
});

app.get("/api/articles/:article_id", (request, response) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }

    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return response.status(404).send({ msg: "Article not found" });
            }
            response.status(200).send({ article: rows[0] });
        });
});

app.get("/api/articles/:article_id/comments", (request, response) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }

    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return response.status(404).send({ msg: "Article not found" });
            }
            return db.query(
                `
                SELECT comment_id, votes, created_at, author, body
                FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC;`,
                [article_id]
            );
        })
        .then((result) => {
            return response.status(200).send({ comments: result.rows });
        });
});
module.exports = app;
