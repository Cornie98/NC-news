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

exports.insertUser = async (newUser) => {
    const { username, name, avatar_url } = newUser;

    if (!username || !name) {
        return Promise.reject({
            status: 400,
            msg: "Missing required fields",
        });
    }

    try {
        const result = await db.query(
            `
            INSERT INTO users (username, name, avatar_url)
            VALUES ($1,$2,$3)
            RETURNING username, name, avatar_url

            `
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === "23505") {
            return Promise.reject({
                status: 409,
                msg: "Username already exists",
            });
        }
        throw error;
    }
};

exports.updateUser = async (
    originalUsername,
    { username, name, avatar_url }
) => {
    const { rows } = await db.query(
        `
        UPDATE users
        SET
            username = COALESCE($1, username),
            name = COALESCE($2, name),
            avatar_url = COALESCE($3, avatar_url)
        WHERE username = $4
        RETURNING username, name, avatar_url;
        `,
        [username, name, avatar_url, originalUsername]
    );

    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
    }

    return rows[0];
};
