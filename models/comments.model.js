const db = require("../db/connection");

exports.selectCommentsByArticle = async (article_id) => {
    const articleResult = await db.query(
        `SELECT * FROM articles WHERE article_id = $1`,
        [article_id]
    );
    if (articleResult.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    }
    const commentResult = await db.query(
        `
        SELECT comment_id, votes, created_at, author, body
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
        [article_id]
    );

    return commentResult.rows;
};

exports.insertCommentByArticle = async (article_id, newComment) => {
    const { username, body } = newComment;

    if (!username || !body) {
        return Promise.reject({
            status: 400,
            msg: "Missing username or body fields",
        });
    }

    const article = await db.query(
        `SELECT * FROM articles WHERE article_id = $1`,
        [article_id]
    );

    if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    }

    const result = await db.query(
        `
        INSERT INTO comments (article_id, author, body) 
        VALUES ($1,$2,$3)
        RETURNING *;
        `,
        [article_id, username, body]
    );
    return result.rows[0];
};
exports.selectCommentById = async (comment_id) => {
    const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = $1`,
        [comment_id]
    );
    if (rows.length === 0) {
        throw { status: 404, msg: "Comment not found" };
    }
    return rows[0];
};

exports.removeComment = async (comment_id) => {
    const { rows } = await db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
        [comment_id]
    );
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
    }
    return;
};

exports.updateCommentVotes = async (comment_id, voteIncrement) => {
    const { rows } = await db.query(
        `UPDATE comments
            SET votes = votes + $1
            WHERE comment_id = $2
            RETURNING *;`,
        [voteIncrement, comment_id]
    );
    if (rows.length === 0) {
        throw { status: 404, msg: "Comment not found" };
    }
    return rows[0];
};
