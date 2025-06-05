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
