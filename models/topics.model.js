const db = require("../db/connection");

exports.selectAllTopics = async () => {
    try {
        const result = await db.query(`SELECT slug, description FROM topics`);
        return result.rows;
    } catch (err) {
        throw err;
    }
};
