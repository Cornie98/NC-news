const db = require("../db/connection");
//const articles = require("../db/data/test-data/articles");

exports.selectAllArticles = (sort_by = "created_at", order = "DESC") => {
    const sortBy = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "comment_count",
    ];
    const orders = ["ASC", "DESC"];

    if (!sortBy.includes(sort_by) || !orders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query" });
    }

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
      ORDER BY ${sort_by} ${order}`
        )
        .then(({ rows }) => rows);
};

exports.selectArticlesById = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
            article_id,
        ])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            }
            return rows[0];
        });
};

exports.updateArticleVotes = (article_id, voteIncrement) => {
    return db
        .query(
            `UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`,
            [voteIncrement, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            }
            return rows[0];
        });
};
