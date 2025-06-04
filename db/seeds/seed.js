const db = require("../connection");
const format = require("pg-format");
const { dropTables, createTables } = require("../manage-tables");
const { convertTimestampToDate } = require("./utils");
const { userArticleUserData } = require("../data/test-data");

const seed = async ({
    topicData,
    userData,
    articleData,
    commentData,
    emojiData,
    emojiArticleUserData,
    userArticleUserData,
    userTopicData,
    savedArticleData,
}) => {
    await dropTables();
    await createTables();

    const insertTopics = format(
        `INSERT INTO topics(slug,description,img_url) VALUES %L RETURNING *;`,
        topicData.map(({ slug, description, img_url }) => [
            slug,
            description,
            img_url,
        ])
    );
    await db.query(insertTopics);

    const insertUsers = format(
        `INSERT INTO users(username,name,avatar_url) VALUES %L RETURNING *;`,
        userData.map(({ username, name, avatar_url }) => [
            username,
            name,
            avatar_url,
        ])
    );
    await db.query(insertUsers);

    const formatArticles = (articles) => {
        return articles.map((article) => {
            const formatted = convertTimestampToDate(article);
            return [
                formatted.title,
                formatted.topic,
                formatted.author,
                formatted.body,
                formatted.created_at,
                formatted.votes,
                formatted.article_img_url,
            ];
        });
    };
    const insertArticles = format(
        `INSERT INTO articles( title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formatArticles(articleData)
    );

    await db.query(insertArticles);

    const formatComments = (comments) => {
        return comments.map((comment) => {
            const formatted = convertTimestampToDate(comment);
            return [
                formatted.article_id,
                formatted.body,
                formatted.votes,
                formatted.author,
                formatted.created_at,
            ];
        });
    };
    const insertComments = format(
        `INSERT INTO comments(article_id,body,votes,author,created_at) VALUES %L RETURNING *;`,
        formatComments(commentData)
    );
    await db.query(insertComments);

    const insertEmojis = format(
        `INSERT INTO emojis(emoji) VALUES %L RETURNING *;`,
        emojiData.map(({ emoji }) => [emoji])
    );
    await db.query(insertEmojis);

    const insertEmojiReact = format(
        `INSERT INTO emoji_article_user(emoji_id, username, article_id) VALUES %L RETURNING *;`,
        emojiArticleUserData.map(({ emoji_id, username, article_id }) => [
            emoji_id,
            username,
            article_id,
        ])
    );
    await db.query(insertEmojiReact);

    const insertUserTopics = format(
        `INSERT INTO user_topic(username,topic) VALUES %L RETURNING *;`,
        userTopicData.map(({ username, topic }) => [username, topic])
    );
    await db.query(insertUserTopics);

    const insertUserArticleVotes = format(
        `INSERT INTO user_article_votes(username,article_id,vote_count) VALUES %L RETURNING *;`,
        userArticleUserData.map(({ username, article_id, vote_count }) => [
            username,
            article_id,
            vote_count,
        ])
    );
    await db.query(insertUserArticleVotes);

    const formattedSavedArticles = savedArticleData.map((entry) => {
        const formatted = convertTimestampToDate(entry);
        return [formatted.username, formatted.article_id, formatted.created_at];
    });

    const insertSavedArticles = format(
        `INSERT INTO saved_articles(username, article_id, created_at) VALUES %L RETURNING *;`,
        formattedSavedArticles
    );

    await db.query(insertSavedArticles);
};

module.exports = seed;
