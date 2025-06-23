const db = require("../db/connection");

exports.getOrAddEmojiId = async (emoji) => {
    const existing = await db.query(
        `SELECT emoji_id FROM emojis WHERE emoji = $1`,
        [emoji]
    );

    if (existing.rows.length) {
        return existing.rows[0].emoji_id;
    }

    const inserted = await db.query(
        `INSERT INTO emojis (emoji) VALUES ($1) RETURNING emoji_id`,
        [emoji]
    );
    return inserted.rows[0].emoji_id;
};

exports.addEmojiReaction = async (article_id, username, emoji_id) => {
    await db.query(`SELECT * FROM articles WHERE article_id = $1`, [
        article_id,
    ]);
    await db.query(`SELECT * FROM users WHERE username = $1`, [username]);

    const inserted = await db.query(
        `INSERT INTO emoji_article_user (emoji_id, username, article_id)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [emoji_id, username, article_id]
    );

    return inserted.rows[0];
};
