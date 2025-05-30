const db = require("./connection");

exports.dropTables = () => {
    const tables = [
        "user_article_votes",
        "user_topic",
        "emoji_article_user",
        "emojis",
        "comments",
        "articles",
        "users",
        "topics",
    ];

    const dropQuery = `DROP TABLE IF EXISTS ${tables.join(", ")} CASCADE;`;

    return db.query(dropQuery);
};

exports.createTables = () => {
    return db.query(
        `CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL,
        img_url VARCHAR(1000)
        );
        
        CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000)
        );
        
        CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );
        
        CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE emojis (
        emoji_id SERIAL PRIMARY KEY,
        emoji VARCHAR NOT NULL
        );
        
        CREATE TABLE emoji_article_user (
        emoji_article_user_id SERIAL PRIMARY KEY,
        emoji_id INT REFERENCES emojis(emoji_id) ON DELETE CASCADE,
        username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        UNIQUE (emoji_id,username,article_id)
        );
        
        CREATE TABLE user_topic (
        user_topic_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        topic VARCHAR NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
        UNIQUE(username, topic)
        );

        CREATE TABLE user_article_votes (
        user_article_votes_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        vote_count INT NOT NULL CHECK (vote_count IN (1,-1)),
        UNIQUE(username, article_id)
        );


    `
    );
};
