const db = require("../db/connection");

exports.selectAllArticles = async (
    sort_by = "created_at",
    order = "DESC",
    topic
) => {
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
    order = order.toUpperCase();

    if (!sortBy.includes(sort_by) || !orders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query" });
    }

    let queryValues = [];
    let queryString = `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id`;

    if (topic) {
        const topicCheck = await db.query(
            `SELECT slug FROM topics WHERE slug = $1`,
            [topic]
        );
        if (topicCheck.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found" });
        }
        queryValues.push(topic);
        queryString += ` WHERE articles.topic = $${queryValues.length}`;
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    const { rows } = await db.query(queryString, queryValues);
    return rows;
};

exports.selectArticleById = async (article_id) => {
    const { rows } = await db.query(
        `SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      articles.body,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
        [article_id]
    );

    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
};

exports.updateArticleVotes = async (article_id, voteIncrement) => {
    const { rows } = await db.query(
        `UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *;`,
        [voteIncrement, article_id]
    );

    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
};

exports.insertArticle = async (newArticle) => {
    const { author, title, body, topic, article_img_url } = newArticle;

    if (!author || !title || !body || !topic) {
        return Promise.reject({
            status: 400,
            msg: "Missing one or more required fields",
        });
    }

    const userResult = await db.query(
        `SELECT * FROM users WHERE username = $1`,
        [author]
    );

    if (userResult.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "Author not found",
        });
    }

    const topicResult = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
        topic,
    ]);
    if (topicResult.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "Topic not found",
        });
    }

    const insertArticleResult = await db.query(
        `
      INSERT INTO articles (author, title, body, topic, article_img_url) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
        [author, title, body, topic, article_img_url]
    );

    return insertArticleResult.rows[0];
};
