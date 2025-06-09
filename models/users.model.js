const db = require("../db/connection");

exports.selectAllUsers = () => {
    return db
        .query(
            `SELECT 
            users.username,
            users.name,
            users.avatar_url
        FROM users`
        )
        .then(({ rows }) => rows);
};

exports.selectUserById = (username) => {
    return db
        .query(
            `SELECT 
        users.username,
        users.name,
        users.avatar_url
        FROM users 
        WHERE users.username = $1`,
            [username]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "User not found",
                });
            }
            return rows[0];
        });
};
