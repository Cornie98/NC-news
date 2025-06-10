const db = require("../db/connection");

exports.selectAllUsers = async () => {
    try {
        const result = await db.query(`
            SELECT 
                users.username,
                users.name,
                users.avatar_url
            FROM users
        `);
        return result.rows;
    } catch (err) {
        throw err;
    }
};

exports.selectUserById = async (username) => {
    try {
        const result = await db.query(
            `
            SELECT 
                users.username,
                users.name,
                users.avatar_url
            FROM users 
            WHERE users.username = $1
        `,
            [username]
        );

        if (result.rows.length === 0) {
            throw {
                status: 404,
                msg: "User not found",
            };
        }

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};
